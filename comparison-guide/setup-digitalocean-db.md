# DigitalOcean PostgreSQL Database Setup

## Step 1: Create a DigitalOcean Managed Database

1. **Log into DigitalOcean Console**
   - Go to https://cloud.digitalocean.com/
   - Navigate to "Databases" in the left sidebar

2. **Create New Database Cluster**
   - Click "Create Database Cluster"
   - Choose **PostgreSQL** as the database engine
   - Select your preferred:
     - **Version**: PostgreSQL 15+ (recommended)
     - **Datacenter region**: Choose closest to your users
     - **Database configuration**: 
       - For development: Basic ($15/month - 1 GB RAM, 1 vCPU, 10 GB disk)
       - For production: Professional ($60/month - 4 GB RAM, 2 vCPU, 90 GB disk)
   - **Database cluster name**: `click-tracker-db` (or your preferred name)

3. **Configure Database Settings**
   - **Trusted sources**: Add your IP addresses that need access
   - **Database name**: Keep default `defaultdb` or create a new one
   - Click "Create Database Cluster"

## Step 2: Get Connection Details

After the database is created (takes 3-5 minutes):

1. **Go to your database cluster**
2. **Copy connection details** from the "Connection Details" section:
   - **Host**: `your-cluster-name-do-user-xxxxx-0.b.db.ondigitalocean.com`
   - **Port**: `25060`
   - **Username**: `doadmin`
   - **Password**: (auto-generated secure password)
   - **Database**: `defaultdb`

3. **Copy the full connection string** - it looks like:
   ```
   postgresql://doadmin:AVNS_yourpassword@your-cluster-name-do-user-xxxxx-0.b.db.ondigitalocean.com:25060/defaultdb?sslmode=require
   ```

## Step 3: Update Your Environment File

1. **Open `.env.local`** in your project
2. **Replace the DATABASE_URL** with your actual connection string:
   ```env
   DATABASE_URL="postgresql://doadmin:AVNS_yourpassword@your-cluster-name-do-user-xxxxx-0.b.db.ondigitalocean.com:25060/defaultdb?sslmode=require"
   ```

## Step 4: Create Database Tables

Run these commands in your project directory:

```bash
# Generate migration files
npm run db:generate

# Apply migrations to create tables
npm run db:migrate
```

## Step 5: Test Connection

You can test the database connection by running:

```bash
# Start your development server
npm run dev

# Test the connection by making a request to the API
curl http://localhost:3000/api/clicks
```

## Step 6: Optional - Create Additional Databases

For better organization, you might want separate databases:

1. **In DigitalOcean console**, go to your database cluster
2. **Click "Databases" tab**
3. **Create new databases**:
   - `click_tracker_prod` (for production)
   - `click_tracker_dev` (for development)
   - `click_tracker_test` (for testing)

Then update your connection strings accordingly.

## Security Best Practices

1. **Firewall Rules**: Only allow connections from your application servers
2. **Connection Pooling**: The connection is already configured for DigitalOcean
3. **SSL**: Always enabled for DigitalOcean managed databases
4. **Environment Variables**: Never commit `.env.local` to version control

## Troubleshooting

### Connection Issues
- Ensure your IP is in the "Trusted Sources"
- Check that SSL is enabled (`sslmode=require`)
- Verify the connection string format

### Performance Issues
- Monitor connection pool usage
- Consider upgrading database plan for high traffic
- Use indexes for better query performance (already included in schema)

### Cost Optimization
- Use connection pooling (already configured)
- Monitor database usage in DigitalOcean console
- Scale down during low-traffic periods if needed

## Monitoring

DigitalOcean provides built-in monitoring:
- **CPU usage**
- **Memory usage** 
- **Disk usage**
- **Connection count**
- **Query performance**

Access these metrics in your database cluster dashboard.