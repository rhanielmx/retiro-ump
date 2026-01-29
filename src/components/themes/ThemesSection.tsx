import { Theme } from './Theme';
import { themesData } from './themesData';

export function ThemesSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Temas das Palestras
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {themesData.map((theme, index) => (
            <Theme key={index} theme={theme} />
          ))}
        </div>
      </div>
    </section>
  );
}