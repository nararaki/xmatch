# 現在のユーザーが管理者権限を持っていない場合に、スクリプトを管理者権限で再実行するための処理です。
if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole("Administrators")) { Start-Process powershell.exe "-File `"$PSCommandPath`"" -Verb RunAs; exit }

# WSL 2 インスタンスの IP アドレスを取得します。
# bash.exe を使って、ip r コマンドを実行し、結果からIPアドレスを抽出します。
# IP アドレスが取得できない場合、スクリプトは終了します。
$ip = bash.exe -c "ip r |tail -n1|cut -d ' ' -f9"
if( ! $ip ){
  echo "The Script Exited, the ip address of WSL 2 cannot be found";
  exit;
}

# 通信を許可するポート番号のリストを指定します。
# このスクリプトでは、22, 3000, 18000 の3つのポートを指定しています。
$ports=@(22,3000,18000);
$ports_a = $ports -join ",";

# 以前に作成されたファイアウォールの例外ルールを削除します。
iex "Remove-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' ";

# New-NetFireWallRule コマンドを使用して、指定したポート番号に対するインバウンドおよびアウトバウンドのファイアウォール例外ルールを作成します。
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Outbound -LocalPort $ports_a -Action Allow -Protocol TCP";
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Inbound -LocalPort $ports_a -Action Allow -Protocol TCP";

# netsh interface portproxy コマンドを使用して、ポートプロキシの設定を行います。
# 指定したポート番号に対して、IP アドレスを介しての接続を許可します。
for( $i = 0; $i -lt $ports.length; $i++ ){
  $port = $ports[$i];
  iex "netsh interface portproxy add v4tov4 listenport=$port listenaddress=* connectport=$port connectaddress=$ip";
}

# 作成されたポートプロキシの設定を表示します。
iex "netsh interface portproxy show v4tov4";
