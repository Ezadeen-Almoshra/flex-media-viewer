import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Lightbox } from '../src/components/Lightbox';
import type { LightboxItem } from '../src/types';

const items: LightboxItem[] = [
  { src: 'https://example.com/one.jpg', title: 'One', type: 'image' },
  { src: 'https://example.com/two.jpg', title: 'Two', type: 'image' },
  { src: 'https://example.com/three.pdf', title: 'Three', type: 'pdf' },
];

describe('Lightbox', () => {
  it('does not render when closed', () => {
    render(<Lightbox open={false} onClose={() => undefined} items={items} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens and shows the current item title', () => {
    render(<Lightbox open onClose={() => undefined} items={items} index={0} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('One')).toBeInTheDocument();
  });

  it('closes via the close button', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Lightbox open onClose={onClose} items={items} />);
    await user.click(screen.getByRole('button', { name: /close lightbox/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape', () => {
    const onClose = vi.fn();
    render(<Lightbox open onClose={onClose} items={items} closeOnEscape />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('navigates with next/prev buttons and reports index changes', async () => {
    const onIndexChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <Lightbox
        open
        onClose={() => undefined}
        items={items}
        index={0}
        onIndexChange={onIndexChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: /next item/i }));
    expect(onIndexChange).toHaveBeenCalledWith(1);

    rerender(
      <Lightbox
        open
        onClose={() => undefined}
        items={items}
        index={1}
        onIndexChange={onIndexChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: /previous item/i }));
    expect(onIndexChange).toHaveBeenCalledWith(0);
  });

  it('navigates with arrow keys', () => {
    const onIndexChange = vi.fn();
    render(
      <Lightbox
        open
        onClose={() => undefined}
        items={items}
        index={0}
        onIndexChange={onIndexChange}
      />,
    );
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it('reports invalid sources via onError', async () => {
    const onError = vi.fn();
    render(
      <Lightbox
        open
        onClose={() => undefined}
        items={[{ src: 'javascript:alert(1)', title: 'Bad' }]}
        onError={onError}
      />,
    );

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
    expect(onError.mock.calls[0]?.[0]?.code).toBe('INVALID_SOURCE');
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('supports a custom toolbar renderer', () => {
    render(
      <Lightbox
        open
        onClose={() => undefined}
        items={items}
        renderToolbar={({ item, onClose }) => (
          <div>
            <span>Custom: {item.title}</span>
            <button type="button" onClick={onClose}>
              Custom Close
            </button>
          </div>
        )}
      />,
    );
    expect(screen.getByText('Custom: One')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Custom Close' })).toBeInTheDocument();
  });

  it('supports a custom item renderer', () => {
    render(
      <Lightbox
        open
        onClose={() => undefined}
        items={items}
        renderItem={(item) => <div data-testid="custom-item">{item.title}</div>}
      />,
    );
    expect(screen.getByTestId('custom-item')).toHaveTextContent('One');
  });

  it('hides toolbar when showToolbar is false', () => {
    render(
      <Lightbox open onClose={() => undefined} items={items} showToolbar={false} />,
    );
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('shows empty-state error when items are empty', () => {
    render(<Lightbox open onClose={() => undefined} items={[]} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('MEDIA_NOT_FOUND')).toBeInTheDocument();
  });

  it('invokes onDownload when download is clicked', async () => {
    const onDownload = vi.fn();
    const user = userEvent.setup();
    render(
      <Lightbox
        open
        onClose={() => undefined}
        items={items}
        showDownload
        onDownload={onDownload}
      />,
    );
    await user.click(screen.getByRole('button', { name: /download/i }));
    expect(onDownload).toHaveBeenCalledWith(items[0]);
  });
});
