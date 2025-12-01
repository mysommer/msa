# msa
# 1. Login til Cloudflare
npx wrangler login

# 2. Opret Database & Vector Index (Hukommelse)
npx wrangler d1 create imsor-core-ledger
npx wrangler vectorize create imsor-policy-index --dimensions=768 --metric=cosine

# 3. Deployer MSA til imsor.com
npx wrangler deploy --name msa-core-v1

# 4. DNS Setup (Mapping)
# Gå til Cloudflare Dashboard -> Workers & Pages -> msa-core-v1 -> Triggers
# Tilføj Custom Domain: api.imsor.com (Min talerstol)
