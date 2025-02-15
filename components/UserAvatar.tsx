import { SVGProps } from "react";

export default function UserAvatar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={40}
      height={40}
      viewBox="0 0 100 100"
      fill="none"
      shapeRendering="auto"
      className="rounded"
      {...props}
    >
      <mask id="viewboxMask">
        <rect width={100} height={100} rx={0} ry={0} x={0} y={0} fill="#fff" />
      </mask>
      <g mask="url(#viewboxMask)">
        <rect fill="#fb8c00" width={120} height={120} x={0} y={0} />
        <g transform="translate(22 68)">
          <path
            d="M27.05 8.44a2 2 0 1 1 3.9-.88C31.72 10.96 34.4 13 38 13c3.6 0 6.28-2.04 7.05-5.44a2 2 0 1 1 3.9.88C47.75 13.7 43.43 17 38 17s-9.76-3.3-10.95-8.56Z"
            fill="#000"
            fillOpacity={0.6}
          />
        </g>
        <g transform="translate(8 20)">
          <rect
            x={7}
            y={16}
            width={91}
            height={16}
            rx={4}
            fill="#000"
            fillOpacity={0.8}
          />
          <mask
            id="eyesRobocop-a"
            style={{
              maskType: "luminance",
            }}
            maskUnits="userSpaceOnUse"
            x={7}
            y={16}
            width={91}
            height={16}
          >
            <rect x={7} y={16} width={91} height={16} rx={4} fill="#fff" />
          </mask>
          <g
            mask="url(#eyesRobocop-a)"
            fillRule="evenodd"
            clipRule="evenodd"
            fill="#fff"
            fillOpacity={0.8}
          >
            <path d="M76 7h18L82 37H64L76 7ZM52 7h9L49 37h-9L52 7Z" />
          </g>
        </g>
      </g>
    </svg>
  );
}
