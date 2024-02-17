export const toOriginArray = (s?: string) => {
  if (!s) return [];

  const originList = (s || '').split(',').map(s => s.trim());

  return originList.map(origin => {
    const originParts = origin.split('.');

    // Search for the specific pattern: domain.tld (e.g. maybe.co) and enable wildcard access on domain
    if (originParts.length === 2) {
      return new RegExp(`${originParts[0]}\\.${originParts[1]}`);
    } else {
      return origin;
    }
  });
};
