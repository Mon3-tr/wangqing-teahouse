import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

type Insets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type Props = HTMLAttributes<HTMLDivElement> & {
  src: string;
  slice: Insets;
  border?: Insets;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  repeat?: "stretch" | "round" | "repeat" | "space";
};

export function NineSliceFrame({
  src,
  slice,
  border = slice,
  className,
  style,
  children,
  repeat = "stretch",
  ...rest
}: Props) {
  return (
    <div
      className={className}
      {...rest}
      style={{
        position: "relative",
        borderStyle: "solid",
        borderWidth: `${border.top}px ${border.right}px ${border.bottom}px ${border.left}px`,
        borderImageSource: `url(${src})`,
        borderImageSlice: `${slice.top} ${slice.right} ${slice.bottom} ${slice.left} fill`,
        borderImageRepeat: repeat,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
