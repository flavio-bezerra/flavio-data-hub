import os
import sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formatdate, make_msgid
from pathlib import Path

def carregar_env_local(caminho_env: Path) -> dict:
    variaveis = {}
    if not caminho_env.exists():
        return variaveis

    with open(caminho_env, 'r', encoding='utf-8') as f:
        for linha in f:
            linha = linha.strip()
            if not linha or linha.startswith('#'):
                continue
            if '=' in linha:
                chave, valor = linha.split('=', 1)
                chave = chave.strip()
                valor = valor.strip()
                # Remover aspas externas se houver
                if (valor.startswith('"') and valor.endswith('"')) or (valor.startswith("'") and valor.endswith("'")):
                    valor = valor[1:-1]
                variaveis[chave] = valor
    return variaveis

def testar_envio(destinatario: str = "flaviomenegueco@gmail.com"):
    raiz = Path(__file__).resolve().parent.parent
    caminho_env = raiz / ".env.local"

    if not caminho_env.exists():
        print(f"[ERRO] Arquivo {caminho_env} nao encontrado.")
        sys.exit(1)

    env = carregar_env_local(caminho_env)

    smtp_host = env.get("SMTP_HOST", "").strip()
    smtp_port_raw = env.get("SMTP_PORT", "").strip()
    smtp_secure_raw = env.get("SMTP_SECURE", "true").strip().lower()
    smtp_user = env.get("SMTP_USER", "").strip()
    smtp_password = env.get("SMTP_PASSWORD", "").strip()
    email_from = env.get("EMAIL_FROM", "").strip() or smtp_user

    print("=== Teste de Envio de E-mail via SMTP ===")
    print(f"Servidor SMTP : {smtp_host}")
    print(f"Porta         : {smtp_port_raw}")
    print(f"SSL/TLS       : {smtp_secure_raw}")
    print(f"Usuario       : {smtp_user}")
    print(f"Remetente     : {email_from}")
    print(f"Destinatario  : {destinatario}")
    print(f"Senha def.    : {'SIM (oculta)' if smtp_password else 'NAO (vazio)'}")
    print("------------------------------------------")

    if not smtp_host:
        print("[ERRO] SMTP_HOST nao esta configurado em .env.local.")
        sys.exit(1)
    if not smtp_port_raw.isdigit():
        print(f"[ERRO] SMTP_PORT invalido: '{smtp_port_raw}'.")
        sys.exit(1)
    if not smtp_user:
        print("[ERRO] SMTP_USER nao esta configurado em .env.local.")
        sys.exit(1)
    if not smtp_password:
        print("[ERRO] SMTP_PASSWORD esta vazio em .env.local.")
        print("Por favor, preencha a senha no .env.local e tente novamente.")
        sys.exit(1)

    smtp_port = int(smtp_port_raw)
    usar_ssl = smtp_port == 465 or smtp_secure_raw in ("true", "1", "yes")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Teste de Conexão — Casamento Victória & Flávio"
    msg["From"] = email_from
    msg["To"] = destinatario
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid()

    texto_puro = (
        "Olá Flávio!\n\n"
        "Este é um e-mail de teste automático enviado pelo sistema do Casamento Victória & Flávio.\n"
        "Se você recebeu esta mensagem, as credenciais e configurações SMTP estão 100% operacionais!\n\n"
        "— Sistema Casamento Victória & Flávio\n"
    )

    texto_html = """\
    <html>
      <body style="font-family: Georgia, serif; color: #2c3e50; line-height: 1.6; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; background: #ffffff;">
          <h2 style="color: #1e3a5f; margin-top: 0;">Teste de Conexão SMTP</h2>
          <p>Olá, <strong>Flávio</strong>!</p>
          <p>Este é um e-mail de teste do casamento de <strong>Victória & Flávio</strong>.</p>
          <p style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 12px; color: #166534;">
            As credenciais e conexões do servidor SMTP (Titan / HostGator) foram validadas com sucesso.
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">
            Enviado automaticamente pelo script de verificação do projeto.
          </p>
        </div>
      </body>
    </html>
    """

    msg.attach(MIMEText(texto_puro, "plain", "utf-8"))
    msg.attach(MIMEText(texto_html, "html", "utf-8"))

    try:
        if usar_ssl:
            print(f"Conectando com SSL a {smtp_host}:{smtp_port}...")
            server = smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=20)
        else:
            print(f"Conectando a {smtp_host}:{smtp_port}...")
            server = smtplib.SMTP(smtp_host, smtp_port, timeout=20)
            server.ehlo()
            print("Iniciando STARTTLS...")
            server.starttls()
            server.ehlo()

        print("Autenticando usuario...")
        server.login(smtp_user, smtp_password)

        print(f"Enviando mensagem para {destinatario}...")
        server.send_message(msg)
        server.quit()

        print("\n[SUCESSO] E-mail enviado com sucesso!")
    except smtplib.SMTPAuthenticationError as e:
        print(f"\n[FALHA DE AUTENTICACAO] Credenciais rejeitadas pelo servidor: {e}")
        sys.exit(2)
    except Exception as e:
        print(f"\n[ERRO] Falha ao enviar e-mail: {e}")
        sys.exit(3)

if __name__ == "__main__":
    dest = sys.argv[1] if len(sys.argv) > 1 else "flaviomenegueco@gmail.com"
    testar_envio(dest)
