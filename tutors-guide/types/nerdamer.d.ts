// types/nerdamer.d.ts
declare module "nerdamer" {
  interface NerdamerExpression {
    text(format?: string): string;
    evaluate(): NerdamerExpression;
    variables(): string[];
  }

  interface NerdamerStatic {
    (expression: string, substitutions?: Record<string, string | number>): NerdamerExpression;
  }

  const nerdamer: NerdamerStatic;
  export default nerdamer;
}

declare module "nerdamer/Algebra";
declare module "nerdamer/Calculus";
declare module "nerdamer/Solve";