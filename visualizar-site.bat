@echo off
setlocal
 title Visualizar site - Victoria e Flavio
cd /d "%~dp0"
if errorlevel 1 goto erro
where node >nul 2>&1
if errorlevel 1 (
    echo Node.js nao encontrado. Instale Node 22.12 ou superior compativel com Vite 7.
    goto erro
)
where npm >nul 2>&1
if errorlevel 1 (
    echo npm nao encontrado no PATH.
    goto erro
)
node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit((a===20 && b>=19)||(a===22 && b>=12)||a>=24?0:1)"
if errorlevel 1 (
    echo Versao de Node incompativel. Recomendado: Node 22.12 ou superior compativel com Vite 7.
    goto erro
)
if not exist "node_modules\.bin\vite.cmd" (
    echo Preparando certificados confiaveis do Windows...
    python scripts\preparar-certificados-npm.py
    if errorlevel 1 goto erro
    echo Instalando dependencias pelo Artifactory corporativo...
    call npm ci --registry=https://artifactory.prod.aws.cloud.ihf/artifactory/api/npm/npm-remotes/ --cafile="%~dp0.local\certificados-npm.pem" --strict-ssl=true --no-audit --no-fund --fetch-retries=0 --fetch-timeout=60000
    if errorlevel 1 goto erro
)
echo.
echo Site local: http://127.0.0.1:8080
echo Para encerrar, pressione Ctrl+C nesta janela.
echo.
start "" "http://127.0.0.1:8080"
call npm run dev -- --host 127.0.0.1 --port 8080 --strictPort
if errorlevel 1 goto erro
exit /b 0
:erro
echo.
echo Nao foi possivel iniciar o site. Confira a mensagem acima.
echo Se houver erro de certificados ou registry, use a configuracao autorizada da rede.
pause
exit /b 1
