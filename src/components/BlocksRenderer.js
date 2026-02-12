import React from 'react';
import Image from 'next/image';
import { getStrapiMedia } from '@/lib/strapiApi';

const BlocksRenderer = ({ content }) => {
    if (!content) return null;

    // Handle if content is not an array (e.g. if it's rich text markdown string)
    if (typeof content === 'string') {
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }

    return (
        <div className="strapi-blocks">
            {content.map((block, index) => {
                switch (block.type) {
                    case 'paragraph':
                        return (
                            <p key={index} className="mb-4">
                                {block.children.map((child, childIndex) => {
                                    if (child.type === 'link') {
                                        return <a key={childIndex} href={child.url} className="text-primary">{child.children[0].text}</a>;
                                    }
                                    let text = child.text;
                                    if (child.bold) text = <strong>{text}</strong>;
                                    if (child.italic) text = <em>{text}</em>;
                                    if (child.underline) text = <u>{text}</u>;
                                    if (child.strikethrough) text = <s>{text}</s>;
                                    if (child.code) text = <code>{text}</code>;
                                    return <React.Fragment key={childIndex}>{text}</React.Fragment>;
                                })}
                            </p>
                        );
                    case 'heading':
                        const HeadingTag = `h${block.level}`;
                        return (
                            <HeadingTag key={index} className="fw-bold mt-4 mb-3 text-dark">
                                {block.children.map((child) => child.text).join('')}
                            </HeadingTag>
                        );
                    case 'list':
                        const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
                        return (
                            <ListTag key={index} className="mb-4 ps-4">
                                {block.children.map((item, itemIndex) => (
                                    <li key={itemIndex} className="mb-2">
                                        {item.children.map((child) => child.text).join('')}
                                    </li>
                                ))}
                            </ListTag>
                        );
                    case 'quote':
                        return (
                            <blockquote key={index} className="border-start border-primary border-4 ps-3 fst-italic my-4 text-muted">
                                {block.children.map((child) => child.text).join('')}
                            </blockquote>
                        );
                    case 'image':
                        const imgUrl = getStrapiMedia(block.image);
                        return (
                            <div key={index} className="my-5 position-relative w-100" style={{ height: '400px' }}>
                                <Image
                                    src={imgUrl}
                                    alt={block.image.alternativeText || 'Blog Image'}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    className="rounded"
                                />
                                {block.image.caption && <p className="text-center text-muted small mt-2">{block.image.caption}</p>}
                            </div>
                        )
                    default:
                        console.warn('Unknown block type', block.type);
                        return null;
                }
            })}
        </div>
    );
};

export default BlocksRenderer;
