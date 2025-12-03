const whitelist = [
  "http://localhost:3000",    
  "http://127.0.0.1:3000",
  "https://your-production-domain.com"
];

export const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (!origin) return callback(null, true);

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
