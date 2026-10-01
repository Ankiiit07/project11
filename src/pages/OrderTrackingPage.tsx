import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, ExternalLink, MapPin, Package, Search, Truck } from 'lucide-react';
import SEO from '../components/SEO';
import { trackOrder, trackShipment, type OrderTracking } from '../services/shiprocketService';

const STEPS = [
  { key: 'placed', label: 'Order placed' },
  { key: 'processing', label: 'Packed, courier assigned' },
  { key: 'shipped', label: 'On the way' },
  { key: 'delivered', label: 'Delivered' },
] as const;

const HEADLINE: Record<string, string> = {
  placed: 'Order received',
  processing: 'Getting ready to ship',
  shipped: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Order cancelled',
};

const formatDate = (d: string | null) => {
  if (!d) return '';
  const date = new Date(d.replace(' ', 'T'));
  return Number.isNaN(date.getTime())
    ? d
    : date.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const LookupForm: React.FC<{ error?: string }> = ({ error }) => {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (!v) return;
    navigate(/^CAO-/i.test(v) ? `/track?orderId=${encodeURIComponent(v.toUpperCase())}` : `/track/${encodeURIComponent(v)}`);
  };
  return (
    <div className="max-w-xl mx-auto text-center">
      <Package className="h-14 w-14 text-primary/60 mx-auto mb-4" />
      <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
        Track your <span className="text-primary">order</span>
      </h1>
      <p className="text-foreground/70 mb-6">Enter your order number (CAO-…) or the courier tracking number from your email.</p>
      {error && <p className="mb-4 text-sm text-red-700" role="alert">{error}</p>}
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="track-input" className="sr-only">Order or tracking number</label>
        <input
          id="track-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. CAO-20261001-AB12CD"
          className="flex-1 h-12 px-4 bg-background border border-border rounded-xl"
          autoComplete="off"
        />
        <button type="submit" className="h-12 px-6 bg-primary text-white rounded-xl font-medium inline-flex items-center justify-center gap-2">
          <Search className="h-4 w-4" /> Track
        </button>
      </form>
      <Link to="/orders" className="inline-flex items-center gap-2 mt-8 text-primary hover:text-primary/80 font-medium">
        <ArrowLeft className="h-4 w-4" /> View all orders
      </Link>
    </div>
  );
};

const OrderTrackingPage: React.FC = () => {
  const { awb: awbParam } = useParams();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const awb = awbParam || searchParams.get('awb');

  const [data, setData] = useState<OrderTracking | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId && !awb) return;
    let live = true;
    setLoading(true);
    setError('');
    setData(null);
    (orderId ? trackOrder(orderId) : trackShipment(awb!))
      .then((d) => live && setData(d))
      .catch((err) => live && setError(err instanceof Error ? err.message : 'Could not load tracking'))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [orderId, awb]);

  const shell = (children: React.ReactNode) => (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <SEO title="Track your order | Cafe at Once" url="https://cafeatonce.com/track" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-12">{children}</div>
    </div>
  );

  if (loading) {
    return shell(
      <div className="flex justify-center py-24" role="status" aria-label="Loading tracking">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }
  if (!data) return shell(<LookupForm error={error} />);

  const { order, tracking } = data;
  const status = order?.status || (tracking?.deliveredDate ? 'delivered' : 'shipped');
  const reached = STEPS.findIndex((s) => s.key === status);
  const headline = tracking?.currentStatus && status !== 'placed' ? tracking.currentStatus : HEADLINE[status];

  return shell(
    <>
      <Link to="/orders" className="inline-flex items-center gap-2 mb-6 text-foreground/70 hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </Link>

      <motion.section
        className="bg-card border border-border rounded-2xl p-5 sm:p-8 mb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            {status === 'delivered' ? <CheckCircle className="h-7 w-7 text-primary" /> : <Truck className="h-7 w-7 text-primary" />}
          </div>
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-bold text-foreground">{headline.charAt(0).toUpperCase() + headline.slice(1).toLowerCase()}</h1>
            {order && <p className="text-sm text-foreground/70">Order <span className="font-medium text-foreground">{order.id}</span></p>}
            {(tracking?.awbCode || order?.awbCode) && (
              <p className="text-sm text-foreground/70 break-all">
                {tracking?.courierName || order?.courierName || 'Courier'} · AWB{' '}
                <span className="font-medium text-foreground">{tracking?.awbCode || order?.awbCode}</span>
              </p>
            )}
            {tracking?.estimatedDelivery && status !== 'delivered' && (
              <p className="mt-2 flex items-center gap-2 text-sm text-foreground/70">
                <Clock className="h-4 w-4" /> Expected by {formatDate(tracking.estimatedDelivery)}
              </p>
            )}
            {status === 'placed' && (
              <p className="mt-2 text-sm text-foreground/70">We pack orders within 24 hours. Your tracking number appears here once a courier is assigned.</p>
            )}
            {tracking?.trackingUrl && (
              <a href={tracking.trackingUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-primary font-medium">
                Open courier tracking <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        {status !== 'cancelled' && (
          <ol className="mt-6 grid grid-cols-4 gap-2" aria-label="Order progress">
            {STEPS.map((step, i) => (
              <li key={step.key} className="text-center">
                <div className={`h-1.5 rounded-full mb-2 ${i <= reached ? 'bg-primary' : 'bg-border'}`} />
                <span className={`block text-[11px] sm:text-xs leading-tight ${i <= reached ? 'text-foreground font-medium' : 'text-foreground/50'}`}>
                  {step.label}
                </span>
              </li>
            ))}
          </ol>
        )}
      </motion.section>

      {!!tracking?.checkpoints.length && (
        <section className="bg-card border border-border rounded-2xl p-5 sm:p-8">
          <h2 className="font-heading text-lg font-bold text-foreground mb-4">Shipment updates</h2>
          <ol className="relative border-l border-border ml-2 space-y-5">
            {tracking.checkpoints.map((c, i) => (
              <li key={i} className="ml-5">
                <span className={`absolute -left-[5px] mt-1.5 w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-primary' : 'bg-border'}`} />
                <p className={`text-sm ${i === 0 ? 'font-medium text-foreground' : 'text-foreground/80'}`}>{c.activity}</p>
                <p className="text-xs text-foreground/60 flex flex-wrap items-center gap-x-2">
                  {formatDate(c.date)}
                  {c.location && (
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.location}</span>
                  )}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
};

export default OrderTrackingPage;
