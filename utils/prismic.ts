export const getTextFromField = (field: any): string => {
    if (!field || !Array.isArray(field)) return '';
    if (field.length === 0) return '';
    const firstItem = field[0];
    if (typeof firstItem === 'string') return firstItem;
    if (firstItem && typeof firstItem === 'object' && 'text' in firstItem) return firstItem.text;
    return '';
};
