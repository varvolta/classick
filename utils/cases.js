export const kebabCase = (string) =>
    string
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase()

export const camelCase = (string) => string.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
