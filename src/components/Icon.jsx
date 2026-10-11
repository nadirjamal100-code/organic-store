export default function Icon({ name, size, width, height, className = '', alt = '' }) {
  return (
    <img
      src={`/icons/${name}.svg`}
      width={width ?? size}
      height={height ?? size}
      alt={alt}
      className={className}
      aria-hidden={alt ? undefined : true}
      draggable="false"
    />
  );
}
