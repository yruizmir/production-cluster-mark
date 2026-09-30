// "prod", "production" or "prd" as a separate word: matches "prod-eu", "k8s_production", "prd01",
// but not "preprod" or "nonprod".
const productionNamePattern = /(^|[^a-z])(prod|production|prd)([^a-z]|$)/i;

export const isProductionName = (name: string) => productionNamePattern.test(name);
