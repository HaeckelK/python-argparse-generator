import { argparseCode, newArgument, defaultSettings } from '../index';

describe('Check Of argparseCode Output', () => {
  const args = [
    {
      name: 'folder',
      type: 'str',
      variableName: 'folder',
      default: '/data',
      required: true,
    },
    { name: 'limit', type: 'int', variableName: 'limit', default: '10', required: true },  ];
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
        { name: 'filename', type: 'str', variableName: 'filename', default: '', required: true },
        { name: 'delay', type: 'int', variableName: 'delay', default: '', required: true },
      ]),
    ).toBe(`import argparse
from typing import Dict, Any


def main(folder: str, limit: int, filename: str, delay: int) -> None:
    # Contents of main
    return


def cli() -> Dict[str, Any]:
    formatter_class = argparse.ArgumentDefaultsHelpFormatter
    parser = argparse.ArgumentParser(formatter_class=formatter_class)

    parser.add_argument("folder", type=str, default="/data")
    parser.add_argument("limit", type=int, default=10)
    parser.add_argument("filename", type=str, default="")
    parser.add_argument("delay", type=int, default=)

    args = parser.parse_args()

    return {"folder": args.folder,
            "limit": int(args.limit),
            "filename": args.filename,
            "delay": int(args.delay)}


if __name__ == '__main__':
    args = cli()
    main(folder=args["folder"],
         limit=args["limit"],
         filename=args["filename"],
         delay=args["delay"])
`);
  });
  test('Type Hints False', () => {
    let settings = defaultSettings();
    settings.typeHints = false;
    expect(argparseCode(args, settings)).toBe(`import argparse


def main(folder, limit):
    # Contents of main
    return


def cli():
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
