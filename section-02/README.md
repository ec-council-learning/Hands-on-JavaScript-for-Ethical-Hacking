# Video 2.2

* [Kali Linux Download](https://www.kali.org/get-kali/#kali-bare-metal)
* Verify file hash
```ps1
# Windows PowerShell
$(Get-FileHash -Algorithm SHA256 {FILE_PATH}}).Hash -eq '{ORIGINAL_HASH}'
```
```sh
# Unix
echo "{ORIGINAL_HASH} {FILE_NAME}" | sha256sum --check
```
* [VirtualBox download](https://www.virtualbox.org/wiki/Downloads)
* [Official Kali Linux Requirements](https://www.kali.org/docs/installation/hard-disk-install/)
* [VirtualBox Network Settings: Complete Guide](https://www.nakivo.com/blog/virtualbox-network-setting-guide/)

## LVM (Logical Volume Manager)

* [When to use LVM](https://blog.vpscheap.net/when-to-use-lvm/)
* [Logical Volume Manager (LVM) versus standard partitioning in Linux](https://www.redhat.com/sysadmin/lvm-vs-partitioning)
* [Pros and cons of encrypted LVM](https://www.reddit.com/r/debian/comments/iyxz9s/pros_and_cons_of_encrypted_lvm/)

# Video 2.3

```sh
if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi
```

```sh
alias ls='ls -lAh --color=always'

function apt-updater {
    sudo apt update &&
    sudo apt dist-upgrade -y &&
    sudo apt autoremove -y &&
    sudo apt autoclean
}
```

* GitHub: [`.bash_aliases`](https://github.com/CyberEthicalMe/configs/blob/master/bash/.bash_aliases)

```sh
sudo apt install docker.io
sudo apt install code-oss
```

```sh
git clone https://github.com/codered-by-ec-council/Hands-on-JavaScript-for-Ethical-Hacking.git
```

# Video 2.4

```sh
sudo docker pull vulnerables/web-dvwa
sudo docker images
sudo docker run --rm -it -d -p 127.0.0.1:8080:80 vulnerables/web-dvwa
```
```sh
sudo docker cp {name-of-containter}:/etc/php/7.0/apache2/php.ini .
sudo docker cp php.ini {name-of-containter}:/etc/php/7.0/apache2/php.ini
sudo docker exec -it {name-of-containter} bash
service apache2 restart
```
```sh
sudo docker ps
sudo docker commit {name-of-containter} vulnerables/web-dvwa:patched
sudo docker images vulnerables/web-dvwa

sudo docker run --rm -it -d -p 127.0.0.1:8080:80 vulnerables/web-dvwa:patched
```

# Video 2.5

```sh
sudo docker pull bkimminich/juice-shop
sudo docker run --rm -it -d -p 127.0.0.1:3000:3000 bkimminich/juice-shop
```