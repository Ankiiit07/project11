import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, RefreshCw, Search, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { accountApi, ApiError, type AdminOrder, type AdminOrdersResponse, type Order } from '../services/accountApi';

const STATUSES: Order['status'][] = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_STYLES: Record<Order['status'], string> = {
  placed: 'bg-amber-50 text-amber-800 border-amber-200',
  processing: 'bg-blue-50 text-blue-800 border-blue-200',
  shipped: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  delivered: 'bg-green-50 text-green-800 border-green-200',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
};

const inr = (n: number) =>
  `₹${(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

const when = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

function downloadCsv(orders: AdminOrder[]) {
  const header = ['Order', 'Date', 'Status', 'Name', 'Email', 'Phone', 'Address', 'City', 'State', 'Pincode', 'Items', 'Total', 'Payment ID', 'AWB'];
  const rows = orders.map((o) => [
    o.id,
    new Date(o.createdAt).toISOString(),
    o.status,
    `${o.customer.firstName} ${o.customer.lastName}`.trim(),
    o.customer.email,
    o.customer.phone,
    o.customer.address,
    o.customer.city,
    o.customer.state,
    o.customer.zipCode,
    o.items.map((i) => `${i.name} x${i.quantity}`).join('; '),
    o.total,
    o.payment?.paymentId || '',
    o.awbCode || '',
  ]);
  const csv = [header, ...rows]
    .map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `cafe-at-once-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const OrderRow: React.FC<{ order: AdminOrder; onChanged: (o: AdminOrder) => void }> = ({ order, onChanged }) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [awb, setAwb] = useState(order.awbCode || '');
  const [error, setError] = useState('');
  const c = order.customer;

  const save = async (status: Order['status'], awbCode?: string) => {
    setSaving(true);
    setError('');
    try {
      onChanged(await accountApi.adminUpdateOrder(order.id, { status, ...(awbCode !== undefined ? { awbCode } : {}) }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the order');
    } finally {
      setSaving(false);
    }
  };

  return (
    <li className="bg-card border border-border rounded-xl">
      <div className="p-4 flex flex-col md:flex-row md:items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex-1 min-w-0 text-left"
          aria-expanded={open}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-heading font-bold text-foreground">{order.id}</span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border capitalize ${STATUS_STYLES[order.status]}`}>
              {order.status}
            </span>
            <span className="text-xs text-foreground/50">{when(order.createdAt)}</span>
          </div>
          <p className="text-sm text-foreground/80 truncate">
            {c.firstName} {c.lastName} · {c.phone} · {c.city}
          </p>
          <p className="text-xs text-foreground/60 truncate">
            {order.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}
          </p>
        </button>
        <div className="flex items-center gap-3 md:justify-end">
          <span className="font-heading font-bold text-foreground whitespace-nowrap">{inr(order.total)}</span>
          <select
            aria-label={`Status for order ${order.id}`}
            value={order.status}
            disabled={saving}
            onChange={(e) => save(e.target.value as Order['status'])}
            className="h-10 px-3 bg-background border border-border rounded-lg text-sm capitalize disabled:opacity-60"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button type="button" onClick={() => setOpen(!open)} className="p-2 text-foreground/60" aria-label="Show details">
            {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {error && <p className="px-4 pb-3 text-sm text-red-700">{error}</p>}

      {open && (
        <div className="border-t border-border p-4 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-bold text-foreground mb-1">Customer</h4>
            <p>{c.firstName} {c.lastName}</p>
            <p><a className="text-primary hover:underline" href={`mailto:${c.email}`}>{c.email}</a></p>
            <p><a className="text-primary hover:underline" href={`tel:${c.phone}`}>{c.phone}</a></p>
            <p className="mt-2 text-foreground/70">{c.address}, {c.city}, {c.state} {c.zipCode}</p>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-1">Items</h4>
            <ul className="space-y-1">
              {order.items.map((i, idx) => (
                <li key={idx} className="flex justify-between gap-2">
                  <span>{i.name} × {i.quantity}{i.type === 'subscription' ? ' (subscription)' : ''}</span>
                  <span>{inr(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-2 pt-2 border-t border-border space-y-0.5 text-foreground/70">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(order.subtotal)}</dd></div>
              {order.discount > 0 && (
                <div className="flex justify-between"><dt>Discount {order.discountCode}</dt><dd>−{inr(order.discount)}</dd></div>
              )}
              <div className="flex justify-between"><dt>Shipping {order.shippingMethod ? `(${order.shippingMethod})` : ''}</dt><dd>{inr(order.shipping)}</dd></div>
              <div className="flex justify-between font-bold text-foreground"><dt>Paid</dt><dd>{inr(order.total)}</dd></div>
            </dl>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-1">Payment & shipping</h4>
            <p className="text-foreground/70 break-all">Razorpay: {order.payment?.paymentId || '—'}</p>
            <label htmlFor={`awb-${order.id}`} className="block mt-3 mb-1 text-foreground/70">AWB / tracking number</label>
            <div className="flex gap-2">
              <input
                id={`awb-${order.id}`}
                value={awb}
                onChange={(e) => setAwb(e.target.value)}
                className="flex-1 min-w-0 h-10 px-3 bg-background border border-border rounded-lg"
                placeholder="e.g. 1234567890"
              />
              <button
                type="button"
                disabled={saving || awb === (order.awbCode || '')}
                onClick={() => save(order.status === 'placed' || order.status === 'processing' ? 'shipped' : order.status, awb.trim())}
                className="h-10 px-4 bg-primary text-white rounded-lg font-medium disabled:opacity-50"
              >
                Save
              </button>
            </div>
            <p className="mt-1 text-xs text-foreground/50">Saving an AWB marks a new order as shipped.</p>
            {!!order.statusHistory?.length && (
              <ul className="mt-3 text-xs text-foreground/60 space-y-0.5">
                {order.statusHistory.map((h, idx) => (
                  <li key={idx}>{when(h.at)}: {h.status} by {h.by}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </li>
  );
};

const AdminOrdersPage: React.FC = () => {
  const { user, ready } = useUser();
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<AdminOrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ status: number; message: string } | null>(null);

  const signedIn = Boolean(user);

  const load = useCallback(async () => {
    if (!ready || !signedIn) return;
    setLoading(true);
    setError(null);
    try {
      setData(await accountApi.adminListOrders({ status, q: query, page }));
    } catch (err) {
      setError({
        status: err instanceof ApiError ? err.status : 0,
        message: err instanceof Error ? err.message : 'Could not load orders',
      });
    } finally {
      setLoading(false);
    }
  }, [ready, signedIn, status, query, page]);

  useEffect(() => {
    load();
  }, [load]);

  // Debounce the search box.
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setQuery(search.trim());
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const replaceOrder = (updated: AdminOrder) =>
    setData((d) => d && { ...d, orders: d.orders.map((o) => (o.id === updated.id ? updated : o)) });

  if (ready && !user) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center px-4 text-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Admin sign-in</h1>
          <p className="text-foreground/70 mb-6">Sign in with your admin account to see orders.</p>
          <Link to="/account" className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-full">Sign in</Link>
        </div>
      </div>
    );
  }

  if (error && (error.status === 403 || error.status === 401)) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center px-4 text-center">
        <div className="max-w-md">
          <ShieldAlert className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">No admin access</h1>
          <p className="text-foreground/70">
            {user?.email} isn't on the admin list. Add it to <code>ADMIN_EMAILS</code> in Netlify and make sure the
            email is verified (signing in with Google counts as verified).
          </p>
        </div>
      </div>
    );
  }

  const s = data?.summary;
  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Orders</h1>
            <p className="text-foreground/70">Every order placed on the site, newest first.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="h-10 px-4 inline-flex items-center gap-2 border border-border rounded-lg bg-card text-sm">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button
              onClick={() => data && downloadCsv(data.orders)}
              disabled={!data?.orders.length}
              className="h-10 px-4 inline-flex items-center gap-2 border border-border rounded-lg bg-card text-sm disabled:opacity-50"
            >
              <Download className="h-4 w-4" /> CSV
            </button>
          </div>
        </div>

        {s && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              ['Today', `${s.todayOrders} · ${inr(s.todayRevenue)}`],
              ['To ship', String(s.counts.placed + s.counts.processing)],
              ['All orders', String(s.totalOrders)],
              ['Revenue (excl. cancelled)', inr(s.revenue)],
            ].map(([label, value]) => (
              <div key={label} className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-foreground/60">{label}</p>
                <p className="font-heading text-xl font-bold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order ID, name, email, phone or payment ID"
              aria-label="Search orders"
              className="w-full h-10 pl-9 pr-3 bg-card border border-border rounded-lg text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
            {['', ...STATUSES].map((st) => (
              <button
                key={st || 'all'}
                onClick={() => {
                  setStatus(st);
                  setPage(1);
                }}
                className={`shrink-0 h-10 px-3 rounded-lg text-sm whitespace-nowrap capitalize border ${
                  status === st ? 'bg-primary text-white border-primary' : 'bg-card border-border text-foreground/80'
                }`}
              >
                {st || 'All'}
                {s && st ? ` (${s.counts[st as Order['status']]})` : ''}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error.message}</p>}

        {!data && loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" aria-label="Loading" />
          </div>
        ) : data && data.orders.length === 0 ? (
          <p className="text-center text-foreground/60 py-16">
            {query || status ? 'No orders match these filters.' : 'No orders yet. New orders will appear here.'}
          </p>
        ) : (
          <ul className="space-y-3">
            {data?.orders.map((o) => <OrderRow key={o.id} order={o} onChanged={replaceOrder} />)}
          </ul>
        )}

        {data && pages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6 text-sm">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-4 h-10 border border-border rounded-lg disabled:opacity-40">
              Previous
            </button>
            <span>Page {page} of {pages}</span>
            <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="px-4 h-10 border border-border rounded-lg disabled:opacity-40">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
