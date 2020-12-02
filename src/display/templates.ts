import Colors from './colors';

/** The layout template for the diagrams. */
// eslint-disable-next-line import/prefer-default-export
export const layoutTemplate = {
  showlegend: false,
  paper_bgcolor: Colors.transparent(),
  plot_bgcolor: Colors.transparent(),
  modebar: {
    bgcolor: Colors.background(),
    color: Colors.onSurface(),
    activecolor: Colors.onSurface(),
  },
  font: {
    color: Colors.onSurface(),
  },
  width: 500,
};
