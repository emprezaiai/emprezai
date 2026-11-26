# Configura en Supabase (proyecto emprezai-pruebas) la URL del sitio y las direcciones permitidas para
# volver desde el enlace de acceso, usando la API de gestion de Supabase.
# Pide la clave personal de Supabase de forma OCULTA: no se guarda, no se muestra y no sale de este equipo
# salvo hacia api.supabase.com. Conserva las direcciones permitidas que ya existan.
# Uso: powershell -ExecutionPolicy Bypass -File scripts/configurar-auth-supabase.ps1

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$ref = 'swzjsvummsbjootngaqb'
$sitio = 'https://emprezai.vercel.app'
$nuevas = @('https://emprezai.vercel.app/**')

$seguro = Read-Host -AsSecureString 'Pega tu clave personal de Supabase (empieza con sbp_) y presiona Enter (no se vera nada al pegar)'
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($seguro)
try { $token = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
$token = $token.Trim()
if (-not $token.StartsWith('sbp_')) {
  Write-Host 'Esa clave no parece una clave personal de Supabase (debe empezar con sbp_). No se cambio nada.'
  exit 1
}

$cabeceras = @{ Authorization = "Bearer $token" }
$url = "https://api.supabase.com/v1/projects/$ref/config/auth"

try {
  $actual = Invoke-RestMethod -Method Get -Uri $url -Headers $cabeceras
} catch {
  Write-Host 'No se pudo leer la configuracion. Revisa que la clave sea correcta y que tu cuenta tenga acceso al proyecto emprezai-pruebas. No se cambio nada.'
  exit 1
}

Write-Host ''
Write-Host 'ANTES'
Write-Host "  Site URL:      $($actual.site_url)"
Write-Host "  Redirect URLs: $($actual.uri_allow_list)"

$lista = @()
if ($actual.uri_allow_list) { $lista = @($actual.uri_allow_list -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ }) }
foreach ($n in $nuevas) { if ($lista -notcontains $n) { $lista += $n } }

$cuerpo = @{ site_url = $sitio; uri_allow_list = ($lista -join ',') } | ConvertTo-Json

try {
  Invoke-RestMethod -Method Patch -Uri $url -Headers $cabeceras -ContentType 'application/json' -Body $cuerpo | Out-Null
  $final = Invoke-RestMethod -Method Get -Uri $url -Headers $cabeceras
} catch {
  Write-Host 'Supabase no acepto el cambio. No se modifico nada mas. Copia este mensaje y avisale a Claude:'
  Write-Host "  $($_.Exception.Message)"
  exit 1
} finally {
  $token = $null
  $cabeceras = $null
}

Write-Host ''
Write-Host 'DESPUES'
Write-Host "  Site URL:      $($final.site_url)"
Write-Host "  Redirect URLs: $($final.uri_allow_list)"
Write-Host ''
if ($final.site_url -eq $sitio -and (($final.uri_allow_list -split ',' | ForEach-Object { $_.Trim() }) -contains $nuevas[0])) {
  Write-Host 'LISTO: configuracion guardada en Supabase.'
} else {
  Write-Host 'ATENCION: el cambio no quedo como se esperaba. Avisale a Claude.'
}
