import { Matcher } from 'interweave';
import React from 'react';

class FooMatcher extends Matcher {
    constructor() {
        super('foo', {
            inverseName: 'noFoo',
            propName: 'foo',
        });
    }

    match(string: string) {
        const result = string.match(/foo/);
        
        if (!result || result.index === undefined) {
            return null;
        }

        return {
            index: result.index,
            length: result[0].length,
            match: result[0],
            extraProp: 'foo',
            valid: true,
        };
    }

    createElement(children: React.ReactNode, props: any) {
        return <span {...props}>{children}</span>;
    }

    asTag() {
        return 'span';
    }
}

// Usage:
const matcher = new FooMatcher();