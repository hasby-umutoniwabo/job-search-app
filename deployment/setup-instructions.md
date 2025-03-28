# Deployment Instructions

This document provides detailed instructions for deploying the Job Search application on two web servers with a load balancer.

## Prerequisites

- Three Ubuntu servers (or virtual machines):
  - Web01: Web server 1
  - Web02: Web server 2
  - Lb01: Load balancer
- Nginx installed on all three servers
- Git installed on all servers
- Basic understanding of server administration and networking

## Step 1: Clone the Repository

On both Web01 and Web02, clone the application repository:

```bash
cd /var/www
sudo git clone https://github.com/hasby-umutoniwabo/job-search-app.git
cd job-search-app
```

## Step 2: Configure API Key

Create and configure the `config.js` file on both servers:

```bash
cd /var/www/job-search-app/js
sudo cp config.js.example config.js
sudo nano config.js
```

Update the file with your RapidAPI key:

```javascript
const CONFIG = {
    API_KEY: '88459c5889msh287ead8ebce95acp1e62fcjsn81bc45bd224e',
    API_HOST: 'jsearch.p.rapidapi.com',
    BASE_URL: 'https://jsearch.p.rapidapi.com'
};
```

## Step 3: Configure Web Servers

### Web01 Server

1. Create Nginx site configuration:

```bash
sudo nano /etc/nginx/sites-available/job-search
```

2. Copy and paste the content from `deployment/nginx-config/web01.conf`.

3. Create a symlink to enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/job-search /etc/nginx/sites-enabled/
```

4. Set proper permissions:

```bash
sudo chown -R www-data:www-data /var/www/job-search-app
```

5. Test and restart Nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Web02 Server

Repeat the same steps as Web01, but use the `web02.conf` configuration file.

## Step 4: Configure Load Balancer

1. Edit the hosts file on the load balancer to resolve Web01 and Web02:

```bash
sudo nano /etc/hosts
```

Add entries for both web servers:

```
192.168.1.101 web01.jobsearch.local  # Replace with actual IP of Web01
192.168.1.102 web02.jobsearch.local  # Replace with actual IP of Web02
```

2. Create Nginx load balancer configuration:

```bash
sudo nano /etc/nginx/sites-available/job-search-lb
```

3. Copy and paste the content from `deployment/nginx-config/lb01.conf`.

4. Create a symlink to enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/job-search-lb /etc/nginx/sites-enabled/
```

5. Test and restart Nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Step 5: Test the Deployment

1. From the load balancer server, test connectivity to the web servers:

```bash
curl -I http://web01.jobsearch.local
curl -I http://web02.jobsearch.local
```

Both should return a 200 OK status.

2. Test the load balancer itself:

```bash
curl -I http://localhost
```

Should return a 200 OK status.

3. Open a web browser and navigate to the load balancer's IP or domain to verify the application is working.

## Step 6: Testing Load Balancing

You can verify the load balancer is distributing traffic between both servers by checking the access logs:

```bash
sudo tail -f /var/log/nginx/access.log
```

On Web01 and Web02, add a unique identifier to verify which server is handling requests:

```bash
sudo nano /var/www/job-search-app/index.html
```

Add a comment at the bottom of the file identifying each server:

```html
<!-- Served from Web01 -->
```

or

```html
<!-- Served from Web02 -->
```

## Troubleshooting

- If you encounter 502 Bad Gateway errors:
  - Check that both web servers are running
  - Verify the IP addresses in the hosts file
  - Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

- If the application loads but can't access the API:
  - Verify the API key in config.js is correct
  - Check browser console for any errors
  - Ensure RapidAPI access is valid

## Additional Considerations

### SSL/TLS Configuration

For a production environment, you should configure SSL/TLS:

1. Install Certbot:

```bash
sudo apt install certbot python3-certbot-nginx
```

2. Obtain and configure SSL certificates:

```bash
sudo certbot --nginx -d jobsearch.example.com
```

### Monitoring

Consider setting up monitoring for your servers:

- Prometheus and Grafana for metrics
- Uptime monitoring (e.g., UptimeRobot, Pingdom)
- Log aggregation (e.g., ELK stack)

### Backups

Implement regular backups of your configuration files and application code:

```bash
sudo rsync -av /var/www/job-search-app /path/to/backup/location
sudo rsync -av /etc/nginx /path/to/backup/location
```

### Security Considerations

- Configure a firewall (e.g., UFW)
- Implement rate limiting (already in the load balancer config)
- Keep all software updated
- Use strong passwords and consider key-based authentication only