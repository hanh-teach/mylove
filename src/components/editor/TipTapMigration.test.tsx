import { describe, it, expect } from 'vitest';
import { NoteDocument } from '../../components/editor/DocumentModel';
import { TipTapBlockEditor } from '../../components/editor/TipTapBlockEditor';
import { render } from '@testing-library/react';
import React from 'react';
import { extractPlainText, migrateLegacyContent } from '../../utils/sanitize';

describe('TipTap Migration & Backward Compatibility', () => {
  it('should convert \\n\\n to separate paragraph tags', () => {
    const plainText = 'Paragraph 1\n\nParagraph 2\n\nParagraph 3';
    const html = migrateLegacyContent(plainText);
    expect(html).toBe('<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p>');
  });

  it('should convert single \\n to <br>', () => {
    const plainText = 'Line 1\nLine 2';
    const html = migrateLegacyContent(plainText);
    expect(html).toBe('Line 1<br>Line 2');
  });

  it('should not alter content that already has HTML', () => {
    const htmlContent = '<p>Already <strong>migrated</strong></p>';
    const html = migrateLegacyContent(htmlContent);
    expect(html).toBe(htmlContent);
  });

  it('should render migrated content properly in TipTapBlockEditor', () => {
    const plainText = 'Paragraph 1\n\nParagraph 2';
    const migratedHtml = migrateLegacyContent(plainText);
    
    const { container } = render(
      <TipTapBlockEditor 
        content={migratedHtml} 
        onChange={() => {}} 
      />
    );
    
    // TipTap wraps its editor in some divs (e.g. .ProseMirror), but we can just check if p tags exist
    const pTags = container.querySelectorAll('p');
    expect(pTags.length).toBe(2);
    expect(pTags[0].textContent).toBe('Paragraph 1');
    expect(pTags[1].textContent).toBe('Paragraph 2');
  });

  it('extractPlainText should handle both plain text and HTML correctly', () => {
    const plain = 'Hello world';
    const html = '<p>Hello <strong>world</strong></p>';
    
    // In jsdom environment, DOMParser is available
    expect(extractPlainText(plain)).toBe('Hello world');
    expect(extractPlainText(html)).toBe('Hello world');
  });
});
