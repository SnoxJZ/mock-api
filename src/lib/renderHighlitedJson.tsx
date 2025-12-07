export const renderHighlightedJson = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const parts = line.split(': ');
    if (parts.length === 2) {
      const [key, value] = parts;
      return (
        <div key={i} className="leading-relaxed">
          <span className="text-chart-1">{key}</span>:{' '}
          <span
            className={
              value.includes('"')
                ? 'text-chart-2'
                : value.match(/\d/)
                  ? 'text-chart-4'
                  : value.includes('{')
                    ? 'text-chart-5'
                    : 'text-chart-3'
            }
          >
            {value}
          </span>
        </div>
      );
    }
    return (
      <div key={i} className="text-chart-5 leading-relaxed">
        {line}
      </div>
    );
  });
};
