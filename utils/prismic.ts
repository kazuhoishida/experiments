import type { RichTextField, TitleField } from '@prismicio/types';
import { asHTML } from '@prismicio/helpers';

type RichTextLike = RichTextField | TitleField | string[] | null | undefined;

const hasText = (value: unknown): value is { text?: unknown } =>
    typeof value === 'object' && value !== null && 'text' in (value as Record<string, unknown>);

export const getTextFromField = (field: RichTextLike): string => {
    if (!field || !Array.isArray(field)) return '';
    if (field.length === 0) return '';
    const firstItem = field[0];
    if (typeof firstItem === 'string') return firstItem;
    if (hasText(firstItem) && typeof firstItem.text === 'string') return firstItem.text;
    return '';
};

export const toHTML = (field: RichTextLike): string => {
    if (!field || !Array.isArray(field)) return '';
    try {
        return asHTML(field as unknown as Parameters<typeof asHTML>[0]);
    } catch {
        return '';
    }
};
