# Databricks notebook source
# MAGIC %md
# MAGIC # Preparar site na pasta Git
# MAGIC Execute primeiro em modo **previa**. Depois selecione **aplicar** e execute novamente.
# MAGIC Ambiente: serverless versão 5+. **publicar_git** aplica, faz commit e push sem force; HostGator continua manual.

# COMMAND ----------
from pathlib import Path, PurePosixPath
import hashlib
import json
import subprocess
import zipfile

from databricks.sdk import WorkspaceClient

dbutils.widgets.dropdown('acao', 'previa', ['previa', 'aplicar', 'publicar_git'])
dbutils.widgets.text('mensagem_commit', 'feat: estrutura do site de casamento e entrega Databricks')
repo = WorkspaceClient().repos.get(1416539554243551)
assert repo.url == 'https://github.com/flavio-bezerra/flavio-data-hub', 'Repositório diferente do autorizado'
assert repo.branch == 'main', 'Selecione main na pasta Git'
target = Path('/Workspace') / repo.path.lstrip('/')
dbutils.widgets.text('pacote', '/Workspace/Users/flavio.bezerra@kinea.com.br/.bundle/casamento-victoria-flavio/dev/files/entrega/site.bin')
package = Path(dbutils.widgets.get('pacote'))

def git(*args: str) -> str:
    result = subprocess.run(['git', '-C', str(target), *args], text=True, capture_output=True, timeout=60)
    if result.returncode != 0:
        raise RuntimeError(json.dumps({
            'comando_git': list(args), 'exit_code': result.returncode,
            'stderr': result.stderr, 'stdout': result.stdout,
            'destino': str(target), 'destino_visivel': target.exists(),
            'destino_diretorio': target.is_dir(),
            'git_visivel': (target / '.git').exists(),
            'git_diretorio': (target / '.git').is_dir(),
            'pacote_visivel': package.is_file(),
        }, ensure_ascii=False))
    return result.stdout.strip()

assert str(target) == '/Workspace/Users/flavio.bezerra@kinea.com.br/flavio-data-hub', 'Destino diferente do autorizado'
assert git('remote', 'get-url', 'origin') == repo.url, 'Remote diferente do autorizado'
assert git('symbolic-ref', '--short', 'HEAD') == 'main', 'Branch local diferente'
assert git('status', '--porcelain') == '', 'Pasta Git tem alterações: preserve ou faça commit delas antes'
remote_commit_before = git('ls-remote', '--exit-code', 'origin', 'refs/heads/main').split()[0]
commit_created = None
remote_commit_after = None
with zipfile.ZipFile(package) as archive:
    manifest = json.loads(archive.read('manifesto-entrega.json'))
    assert git('rev-parse', 'HEAD') == manifest['base_commit'], 'HEAD diferente: concilie a base antes de aplicar'
    assert remote_commit_before == manifest['base_commit'], 'Main remota divergente: concilie antes de aplicar'
    pending = []
    for record in manifest['files']:
        relative = PurePosixPath(record['path'])
        assert not relative.is_absolute() and '..' not in relative.parts and '\\' not in str(relative), 'Caminho inválido'
        assert relative.parts[0] not in {'.git', '.databricks', 'entrega', 'node_modules'}, 'Caminho reservado'
        destination = target.joinpath(*relative.parts)
        assert not any(parent.is_symlink() for parent in [destination, *destination.parents]), 'Link simbólico no destino'
        old = destination.read_bytes() if destination.is_file() else None
        old_hash = hashlib.sha256(old).hexdigest() if old is not None else None
        assert old_hash == record['base_sha256'], f'Conflito local: {relative}'
        new = archive.read(str(relative)) if record['sha256'] is not None else None
        assert (hashlib.sha256(new).hexdigest() if new is not None else None) == record['sha256'], 'Hash de entrega inválido'
        if old_hash != record['sha256']:
            pending.append((destination, new))
    print('Alterações previstas:')
    for destination, new in pending:
        print(('EXCLUIR ' if new is None else 'GRAVAR '), destination.relative_to(target))
    # Testa autenticação de escrita sem enviar alterações.
    git('push', '--dry-run', 'origin', 'HEAD:refs/heads/main')
    if dbutils.widgets.get('acao') in {'aplicar', 'publicar_git'}:
        workflow = archive.read('.github/workflows/deploy.yml').decode('utf-8')
        assert 'workflow_dispatch:' in workflow and '\n  push:' not in workflow, 'Publicação HostGator precisa ser manual'
        assert git('status', '--porcelain') == '', 'Destino mudou durante a conferência'
        assert git('ls-remote', '--exit-code', 'origin', 'refs/heads/main').split()[0] == remote_commit_before, 'Remoto mudou durante a conferência'
        for destination, new in pending:
            if new is None:
                destination.unlink()
            else:
                destination.parent.mkdir(parents=True, exist_ok=True)
                destination.write_bytes(new)
        print('Entrega aplicada.')
        if dbutils.widgets.get('acao') == 'publicar_git' and pending:
            changed_paths = [str(destination.relative_to(target)) for destination, _ in pending]
            git('add', '--', *changed_paths)
            staged_paths = set(git('diff', '--cached', '--name-only', '-z').split('\0')) - {''}
            assert staged_paths == set(changed_paths), 'Índice diferente da entrega: revisar antes de commit'
            identity = WorkspaceClient().current_user.me()
            git('-c', f'user.name={identity.display_name or identity.user_name}', '-c', f'user.email={identity.user_name}',
                'commit', '-m', dbutils.widgets.get('mensagem_commit'))
            commit_created = git('rev-parse', 'HEAD')
            git('push', 'origin', 'HEAD:refs/heads/main')
            remote_commit_after = git('ls-remote', '--exit-code', 'origin', 'refs/heads/main').split()[0]
            assert remote_commit_after == commit_created, 'Commit remoto não confirmado'
            assert git('status', '--porcelain') == '', 'Destino não ficou limpo após commit'
            print('Commit/push confirmado:', commit_created)
    else:
        print('Prévia apenas. Nenhum arquivo alterado.')

# COMMAND ----------
dbutils.notebook.exit(json.dumps({
    'acao': dbutils.widgets.get('acao'),
    'base_commit': manifest['base_commit'],
    'arquivos_verificados': len(manifest['files']),
    'alteracoes': [{'path': str(destination.relative_to(target)), 'operacao': 'excluir' if new is None else 'gravar'} for destination, new in pending],
    'aplicado': dbutils.widgets.get('acao') in {'aplicar', 'publicar_git'},
    'remote_commit_before': remote_commit_before,
    'commit_created': commit_created,
    'remote_commit_after': remote_commit_after,
}, ensure_ascii=False))
