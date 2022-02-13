# Python Argparse Generator

[![npm version](https://img.shields.io/npm/v/python-argparse-generator.svg?style=flat-square)](https://www.npmjs.org/package/python-argparse-generator)

Package for generation of Python code (as text) to streamline writing boilerplate Python argparse setup.

## Installing

Using npm:

```bash
$ npm install python-argparse-generator
```

Using unpkg CDN:

```html
<script src="https://unpkg.com/python-argparse-generator/lib/index.js"></script>
```

## Example

Within HTML:
```html
<html>
<head>
    <script>var exports={}</script>
    <script src="https://unpkg.com/python-argparse-generator/lib/index.js"></script>
</head>
<script>
    const pythonCode = GenerateCode([
        { name: 'folder', type: 'str', variableName: 'folder', default: '"/data"', defaultDisplay: '"/data"' },
        { name: 'limit', type: 'int', variableName: 'limit', default: '10', defaultDisplay: '10' },
    ]);
    console.log(pythonCode);
</script>
</html>
```

Within Typescript:

```ts
import { Argument, GenerateCode } from 'python-argparse-generator';

const args: Argument[] = [
    { name: 'folder', type: 'str', variableName: 'folder', default: '"/data"', defaultDisplay: '"/data"' },
    { name: 'limit', type: 'int', variableName: 'limit', default: '10', defaultDisplay: '10' },
];

const pythonCode = GenerateCode(args);
```

Where content of `pythonCode` string is:

```python
import argparse
from typing import Dict, Any
  
def main(folder: str, limit: int) -> None:
    # Contents of main
    return


def cli() -> Dict[str, Any]:
    formatter_class = argparse.ArgumentDefaultsHelpFormatter
    parser = argparse.ArgumentParser(formatter_class=formatter_class)

    parser.add_argument("folder", type=str, default="/data")
    parser.add_argument("limit", type=int, default=10)

    args = parser.parse_args()

    return {"folder": args.folder,
            "limit": int(args.limit)}

if __name__ == '__main__':
    args = cli()
    main(folder=args["folder"], limit=args["limit"])
```