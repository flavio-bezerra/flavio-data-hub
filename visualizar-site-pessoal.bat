@echo off
setlocal
title Casamento - maquina pessoal
cd /d "%~dp0"
if errorlevel 1 goto erro
where node >nul 2>&1
if errorlevel 1 goto requisitos
where npm >nul 2>&1
if errorlevel 1 goto requisitos
node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit((a===20 && b>=19)||(a===22 && b>=12)||a>=24?0:1)"
if errorlevel 1 goto requisitos
if not exist "package-lock.json" goto erro
if not exist "node_modules\.bin\vite.cmd" (
    echo Instalando dependencias pelo npm publico...
    call npm ci --registry=https://registry.npmjs.org/ --strict-ssl=true --no-audit --no-fund --fetch-retries=2 --fetch-timeout=60000
    if errorlevel 1 goto erro
)
echo Site local: http://127.0.0.1:8080
echo Para encerrar, pressione Ctrl+C nesta janela.
start "" "http://127.0.0.1:8080"
call npm run dev -- --host 127.0.0.1 --port 8080 --strictPort
if errorlevel 1 goto erro
exit /b 0
:requisitos
echo Instale Node.js 24 LTS com npm e abra este arquivo novamente.
goto erro
:erro
echo Nao foi possivel iniciar. Confira a mensagem acima.
echo Use este arquivo no clone completo do projeto, fora da rede corporativa.
pause
exit /b 1
