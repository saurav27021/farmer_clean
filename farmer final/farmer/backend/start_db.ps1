$mongoPath = "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe"
$dataDir = ".\data"

if (!(Test-Path $dataDir)) {
    New-Item -ItemType Directory -Force -Path $dataDir
}

Start-Process -FilePath $mongoPath -ArgumentList "--dbpath $dataDir" -NoNewWindow
Write-Host "MongoDB started with data directory: $dataDir"
