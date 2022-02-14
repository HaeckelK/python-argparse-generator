import { argparseCode, newArgument } from '../index';

test('Basic check of output', () => {
  expect(
    argparseCode([
      {
        name: 'folder',
        type: 'str',
        variableName: 'folder',
        default: '/data',
        required: true,
      },
      { name: 'limit', type: 'int', variableName: 'limit', default: '10', required: true },
    ]),
  ).toBe(`import argparse
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
    main(folder=args["folder"],
         limit=args["limit"])
`);
});

describe('New Argument Factory', () => {
  test('Default Parameters', () => {
    expect(newArgument('folder', 'str')).toStrictEqual({
      name: 'folder',
      type: 'str',
      default: '',
      variableName: 'folder',
      required: false,
    });
  });
  // TODO really I should have a variableNameCreate function
  test('Variable Name Creation', () => {
    expect(newArgument('time-delay', 'str')).toStrictEqual({
      name: 'time-delay',
      type: 'str',
      default: '',
      variableName: 'timedelay',
      required: false,
    });
  });
  test('All Params', () => {
    expect(newArgument('folder', 'str', 'folder', '/data', true)).toStrictEqual({
      name: 'folder',
      type: 'str',
      default: '/data',
      variableName: 'folder',
      required: true,
    });
  });
});
