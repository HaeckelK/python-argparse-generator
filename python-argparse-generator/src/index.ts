export type Argument = {
  name: string;
  type: string;
  variableName: string;
  default: string;
  required: boolean;
};

function argumentToText(argument: Argument) {
  switch (argument.type) {
    case 'bool':
      return `parser.add_argument("${argument.name}", action="store_${argument.default}")`;
    default:
      let defaultDisplay;

      if (argument.type === 'str') {
        defaultDisplay = `"${argument.default}"`;
      } else {
        defaultDisplay = argument.default;
      }

      if (argument.default === undefined) {
        return `parser.add_argument("${argument.name}", type=${argument.type})`;
      } else {
        return `parser.add_argument("${argument.name}", type=${argument.type}, default=${defaultDisplay})`;
      }
  }
}

const argumentToMainParams = (argument: Argument) => `${argument.variableName}: ${argument.type}`;

export const GenerateCode = (args: Argument[]) => {
  const mainParameters: string[] = args.map((arg) => argumentToMainParams(arg));
  const argumentsText: string[] = args.map((arg) => argumentToText(arg));
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
    parser = argparse.ArgumentParser(formatter_class=formatter_class)

    ${argumentsText.join('\n    ')}

    args = parser.parse_args()

    return {${returnText.join('\n            ').slice(0, -1)}}

if __name__ == '__main__':
    args = cli()
    main(${args.map((x) => `${x.variableName}=args["${x.variableName}"]`).join(', ')})
`;
  return output;
};
