 import dotenv from 'dotenv';
 dotenv.config();
 
 export const databaseConfig = {
  url: process.env.SUPABASE_DB_URL,  
  dialect: 'postgres',
  dialectOptions: { 
    ssl: { 
      require: true, 
      rejectUnauthorized: false 
    } 
  },
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  },
  logging: false
};
