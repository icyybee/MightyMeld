export function Tile({ content: Content, flip, state, wronglyMatched }) {
  switch (state) {
    case "start":
      return (
        <Back
          className="inline-block size-[60px] rounded-lg bg-indigo-300 text-center cursor-pointer hover:shadow-[0_0_8px_#3b82f680] transition-all ease-in-out"
          flip={flip}
        />
      );
    case "flipped":
      return (
        <Front className={`${wronglyMatched ? 'animate__headShake' : 'animate__flipInX'} animate__animated inline-block size-[60px] rounded-lg bg-indigo-500 p-[7px] cursor-pointer`}>
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
              fill: "white",
            }}
          />
        </Front>
      );
    case "matched":
      return (
        <Matched className="inline-block size-[60px] text-gray-300">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
              fill: "#c7d2fe",
            }}
          />
        </Matched>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}

function Back({ className, flip }) {
  return <div onClick={flip} className={className}></div>;
}

function Front({ className, children }) {
  return <div className={className}>{children}</div>;
}

function Matched({ className, children }) {
  return <div className={className}>{children}</div>;
}
