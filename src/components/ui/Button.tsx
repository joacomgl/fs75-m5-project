type ButtonSize = 'small' | 'medium' | 'large';

type SolidButtonProps = {
  variant: 'solid';
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
};

type LinkButtonProps = {
  variant: 'link';
  href: string;
  target?: "_self" | "_blank" | "_parent" | "_top";
};

type SharedProps = {
  size?: ButtonSize;
  children: React.ReactNode;
};

type ButtonProps = (SolidButtonProps | LinkButtonProps) & SharedProps;

export function Button(props: ButtonProps) {
  const size = props.size ?? "medium"

  if (props.variant === "link") {
    return (
      <a
        href={props.href}
        target={props.target}
      >
        {props.children}
      </a>
    );
  }

  const isDisabled = props.disabled || props.loading;
  return (
    <button
      type="button"
      className={`btn btn-solid btn-${size}`}
      disabled={isDisabled}
      onClick={props.onClick}
    >
      {props.loading ? "Cargando..." : props.children}
    </button>
  );
}