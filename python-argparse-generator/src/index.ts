export type Argument = {
  name: string;
  type: string;
  variableName: string;
  default: string;
  required: boolean;
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

export const argparseCode = (args: Argument[], parserName: string = "parser") => {
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
    # Contents of main
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
