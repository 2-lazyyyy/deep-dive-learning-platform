$files = Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts,*.css
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $changed = $false
    
    if ($content -match '#58CC02') {
        $content = $content -replace '#58CC02', '#077d8a'
        $changed = $true
    }
    if ($content -match '#46A302') {
        $content = $content -replace '#46A302', '#05646E'
        $changed = $true
    }
    if ($content -match '#E8F5E9') {
        $content = $content -replace '#E8F5E9', '#E0F2F5'
        $changed = $true
    }
    
    if ($changed) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated $($file.FullName)"
    }
}
