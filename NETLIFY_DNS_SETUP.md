# DNS Setup Instructions for Namecheap

This document provides step-by-step instructions for configuring DNS records in Namecheap to point your domain to Netlify.

## Prerequisites

- Domain purchased and managed through Namecheap: `agents-11.com`
- Netlify account set up with your site deployed
- Netlify site URL ready (e.g., `your-site-name.netlify.app`)

## Step 1: Get Your Netlify Site Information

1. Log into your Netlify dashboard
2. Navigate to your site
3. Go to **Site settings** → **Domain management**
4. Note down your site's default Netlify URL: `https://your-site-name.netlify.app`

## Step 2: Configure DNS Records in Namecheap

### Login to Namecheap

1. Go to [namecheap.com](https://www.namecheap.com)
2. Sign in to your account
3. Navigate to **Account** → **Dashboard**
4. Find your domain `agents-11.com` and click **Manage**

### Configure DNS Records

1. Click on the **Advanced DNS** tab
2. Delete any existing A records or CNAME records that might conflict
3. Add the following DNS records:

#### Primary Domain (agents-11.com)

**Option A: Using Netlify's Load Balancer (Recommended)**
```
Type: A Record
Host: @
Value: 75.2.60.5
TTL: Automatic (or 1800)
```

**Additional A Records for Redundancy:**
```
Type: A Record
Host: @
Value: 99.83.190.102
TTL: Automatic (or 1800)
```

```
Type: A Record
Host: @
Value: 3.33.152.147
TTL: Automatic (or 1800)
```

```
Type: A Record
Host: @
Value: 3.248.220.207
TTL: Automatic (or 1800)
```

#### WWW Subdomain (Redirect to non-www)

```
Type: CNAME Record
Host: www
Value: agents-11.com
TTL: Automatic (or 1800)
```

#### Alternative: Direct CNAME to Netlify (if you prefer www)

If you want `www.agents-11.com` to be your primary domain:

```
Type: CNAME Record
Host: www
Value: your-site-name.netlify.app
TTL: Automatic (or 1800)
```

And redirect the root domain:
```
Type: URL Redirect Record
Host: @
Value: https://www.agents-11.com
Redirect Type: Permanent (301)
TTL: Automatic
```

## Step 3: Configure Custom Domain in Netlify

1. In your Netlify site settings, go to **Domain management**
2. Click **Add custom domain**
3. Enter your domain: `agents-11.com`
4. Click **Verify**
5. Netlify will automatically detect your DNS configuration

### Add www subdomain (if using non-www as primary)

1. Click **Add domain alias**
2. Enter: `www.agents-11.com`
3. This will handle the redirect from www to non-www

## Step 4: SSL Certificate Configuration

Netlify automatically provisions SSL certificates via Let's Encrypt:

1. Go to **Site settings** → **Domain management**
2. Scroll down to **HTTPS** section
3. Verify that **SSL/TLS certificate** shows as "Netlify certificate"
4. Enable **Force HTTPS** to redirect all HTTP traffic to HTTPS

## Step 5: Verification

### DNS Propagation Check

DNS changes can take 24-48 hours to fully propagate. You can check the status using:

1. **Online Tools:**
   - [whatsmydns.net](https://www.whatsmydns.net)
   - [dnschecker.org](https://dnschecker.org)

2. **Command Line:**
   ```bash
   # Check A records
   nslookup agents-11.com
   
   # Check CNAME records
   nslookup www.agents-11.com
   
   # Check from different DNS servers
   nslookup agents-11.com 8.8.8.8
   ```

### Test Your Site

1. **Main domain:** `https://agents-11.com`
2. **WWW redirect:** `https://www.agents-11.com` (should redirect to main)
3. **HTTPS redirect:** `http://agents-11.com` (should redirect to HTTPS)

## Troubleshooting

### Common Issues

1. **DNS not propagating:**
   - Wait 24-48 hours for full propagation
   - Clear your DNS cache: `sudo dscacheutil -flushcache` (macOS)

2. **SSL certificate not provisioning:**
   - Ensure DNS records point to Netlify
   - Wait for DNS propagation
   - Contact Netlify support if certificate doesn't provision within 24 hours

3. **Redirect loops:**
   - Check that you're not redirecting www to www
   - Verify Netlify redirect rules in `netlify.toml`

4. **404 errors:**
   - Ensure your build deployed successfully
   - Check that the publish directory is set correctly

### DNS Record Summary

For quick reference, here are the final DNS records you should have:

```
Type: A       | Host: @   | Value: 75.2.60.5
Type: A       | Host: @   | Value: 99.83.190.102  
Type: A       | Host: @   | Value: 3.33.152.147
Type: A       | Host: @   | Value: 3.248.220.207
Type: CNAME   | Host: www | Value: agents-11.com
```

## Advanced Configuration

### Email Records (if using external email service)

If you're using an external email service like Google Workspace or Outlook, you'll need to add MX records. Consult your email provider's documentation.

### Subdomains

To add subdomains (e.g., `api.agents-11.com`):

```
Type: CNAME Record
Host: api
Value: your-api-service.herokuapp.com (or wherever your API is hosted)
TTL: Automatic
```

## Security Considerations

1. **DNSSEC:** Consider enabling DNSSEC in Namecheap for additional security
2. **CAA Records:** Consider adding CAA records to control which Certificate Authorities can issue certificates for your domain

```
Type: CAA Record
Host: @
Value: 0 issue "letsencrypt.org"
```

## Monitoring

Set up monitoring for your domain:

1. **Uptime monitoring:** Use services like UptimeRobot or Pingdom
2. **SSL certificate monitoring:** Monitor certificate expiration
3. **DNS monitoring:** Track DNS changes and propagation

## Support

- **Netlify Support:** [support.netlify.com](https://support.netlify.com)
- **Namecheap Support:** [support.namecheap.com](https://support.namecheap.com)
- **DNS Troubleshooting:** [Network Tools](https://network-tools.com)

---

**Important Notes:**
- Always test changes in a staging environment first
- Keep backups of your current DNS settings before making changes
- DNS propagation can take up to 48 hours globally
- SSL certificates may take a few minutes to provision after DNS is properly configured