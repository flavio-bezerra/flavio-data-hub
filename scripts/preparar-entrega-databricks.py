"""Empacota arquivos versionáveis com hashes e referência Git para entrega manual."""
from pathlib import Path
import hashlib
import json
import subprocess
import zipfile

root = Path(__file__).resolve().parents[1]

def git(*args: str) -> bytes:
    return subprocess.check_output(['git', *args], cwd=root)

base_commit = git('rev-parse', 'HEAD').decode().strip()
tracked = set(git('ls-files', '-z').decode().split('\0')) - {''}
paths = set(git('ls-files', '--cached', '--others', '--exclude-standard', '-z').decode().split('\0')) - {''}
records = []
# Extensão .bin evita importação automática do ZIP como diretório/notebook.
package = root / 'entrega' / 'site.bin'
package.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(package, 'w', zipfile.ZIP_DEFLATED) as archive:
    for name in sorted(paths):
        parts = Path(name).parts
        if parts[0] in {'entrega', '.git', '.databricks', '.verificacao', 'node_modules', 'dist'}:
            continue
        if any(part.startswith('.env') or part == '.npmrc' or part.endswith('.local') for part in parts):
            continue
        file = root / name
        if file.is_symlink():
            raise RuntimeError(f'Link simbólico exige revisão: {name}')
        base = git('show', f'{base_commit}:{name}') if name in tracked else None
        content = file.read_bytes() if file.is_file() else None
        records.append({'path': name, 'sha256': hashlib.sha256(content).hexdigest() if content is not None else None,
                        'base_sha256': hashlib.sha256(base).hexdigest() if base is not None else None})
        if content is not None:
            archive.writestr(name, content)
    archive.writestr('manifesto-entrega.json', json.dumps({'base_commit': base_commit, 'files': records}, ensure_ascii=False, indent=2))
print(f'Entrega: {package}; arquivos: {len(records)}; base Git: {base_commit}')
print(f'SHA256 ZIP: {hashlib.sha256(package.read_bytes()).hexdigest()}')
