import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL || 'mysql://3BvLDKze3JSLUug.root:ICFc57lvrgO2A3eb@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict',
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
