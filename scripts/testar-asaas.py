import urllib.request
import urllib.error
import json
from pathlib import Path

def carregar_env():
    env = {}
    caminho = Path(__file__).resolve().parent.parent / ".env.local"
    if not caminho.exists():
        return env
    with open(caminho, "r", encoding="utf-8") as f:
        for linha in f:
            linha = linha.strip()
            if linha and not linha.startswith("#") and "=" in linha:
                k, v = linha.split("=", 1)
                k = k.strip()
                v = v.strip().strip("'\"")
                env[k] = v
    return env

def testar_asaas():
    env = carregar_env()
    token = env.get("ASAAS_PAYMENT_TOKEN", "")
    if not token:
        print("[ERRO] ASAAS_PAYMENT_TOKEN nao encontrado no .env.local")
        return

    print("=== Testando Token Asaas ===")
    
    # Testar primeiro no Sandbox
    urls = [
        ("Sandbox", "https://sandbox.asaas.com/api/v3/myAccount"),
        ("Producao", "https://api.asaas.com/api/v3/myAccount")
    ]

    for ambiente, url in urls:
        print(f"\nTestando ambiente: {ambiente} ({url})...")
        req = urllib.request.Request(
            url,
            headers={
                "access_token": token,
                "User-Agent": "Casamento-App/1.0"
            }
        )
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                status = resp.status
                data = json.loads(resp.read().decode("utf-8"))
                print(f"[SUCESSO em {ambiente}] HTTP {status}")
                print(f"Nome da conta : {data.get('name', 'N/A')}")
                print(f"Email         : {data.get('email', 'N/A')}")
                print(f"Ambiente confirmado: {ambiente}")
                return
        except urllib.error.HTTPError as e:
            print(f"[HTTP {e.code}] em {ambiente}: {e.reason}")
            try:
                err_body = e.read().decode("utf-8")
                print(f"Detalhes: {err_body}")
            except Exception:
                pass
        except Exception as e:
            print(f"[ERRO] em {ambiente}: {e}")

if __name__ == "__main__":
    testar_asaas()
