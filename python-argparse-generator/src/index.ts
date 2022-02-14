export type Settings = {
  parserName: string;
  typeHints: boolean;
  mainContents: string;
}

export const defaultSettings = (): Settings => {
  return {parserName: "parser",
          typeHints: true,
          mainContents: "# Contents of main"};
};

export type Argument = {
  name: string;
  type: string;
  variableName: string;
  default: string;
  required: boolean;
};

export const newArgument = (
  name: string,
  type: string,
  variableName: string = '',
  defaultValue: string = '',
  required: boolean = false,
): Argument => {
  if (variableName === '') {
    variableName = name.replace(/-/g, '');
  }
  return { name, type, variableName, default: defaultValue, required };
};

function argumentToText(argument: Argument, parserName: string) {
  switch (argument.type) {
    case 'bool':
      return `${parserName}.add_argument("${argument.name}", action="store_${argument.default}")`;
    default:
      let defaultDisplay;

      if (argument.type === 'str') {
        defaultDisplay = `"${argument.default}"`;
      } else {
        defaultDisplay = argument.default;
      }

      if (argument.default === undefined) {
        return `${parserName}.add_argument("${argument.name}", type=${argument.type})`;
      } else {
        return `${parserName}.add_argument("${argument.name}", type=${argument.type}, default=${defaultDisplay})`;
      }
  }
}

const argumentToMainParams = (argument: Argument) => `${argument.variableName}: ${argument.type}`;

export const argparseCode = (args: Argument[], settings: Settings =  defaultSettings()) => {
  const parserName: string = settings.parserName;
  const mainParameters: string[] = args.map((arg) => argumentToMainParams(arg));
  const argumentsText: string[] = args.map((arg) => argumentToText(arg, parserName));
  const returnText: string[] = args.map((x) => {
    if (x.type === 'str') {
      return `"${x.variableName}": args.${x.variableName},`;
    } else {
      return `"${x.variableName}": ${x.type}(args.${x.variableName}),`;
    }
  });

  const output = `import argparse
from typing import Dict, Any
  
def main(${mainParameters.join(', ')}) -> None:
    ${settings.mainContents}
    return


def cli() -> Dict[str, Any]:
    formatter_class = argparse.ArgumentDefaultsHelpFormatter
    ${parserName} = argparse.ArgumentParser(formatter_class=formatter_class)

    ${argumentsText.join('\n    ')}

    args = ${parserName}.parse_args()

    return {${returnText.join('\n            ').slice(0, -1)}}

if __name__ == '__main__':
    args = cli()
    main(${args.map((x) => `${x.variableName}=args["${x.variableName}"]`).join(',\n         ')})
`;
  return output;
};
