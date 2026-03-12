$path = 'c:\Users\mohan\EDD_QIB\edd_system\organization.html'
$content = Get-Content $path -Raw
# Remove the name div with both potential encodings
$newContent = $content -replace '<div class="exec-card-name">Raafat Alrantski</div>', ''
$newContent = $newContent -replace '<div class="exec-card-name">Raafat Alrantski</div>', ''
$newContent | Set-Content $path -Encoding UTF8 -Force
Write-Host "Removed Raafat names"
