/* Coastline mask for the global footprint map.
   104 x 48 cells, run-length encoded (base36 lengths, '.' separated,
   runs alternate starting with sea). Source: Natural Earth 110m land
   polygons, equirectangular, 80N to 56S. */
(function () {
  var COLS = 104, ROWS = 48;
  var ENC = "m.1.1.n.8.4.k.3.13.4.2.6.3.f.l.2.7.8.7.2.q.6.1.7.6.a.l.2.3.1.2.e.3.3.e.7.1.a.1.8.4.a.b.5.9.t.1.6.1.p.1.4.2.7.d.1c.1.2.1.o.2.4.3.4.4.3.7.1d.4.l.4.3.6.2.d.4.1.19.6.3.3.e.4.5.j.4.1.13.1.1.j.e.1.6.f.2.2.3.1.y.5.2.j.m.d.3.1.15.3.1.l.l.f.17.q.i.1.2.e.16.r.i.h.a.2.t.1.1.q.g.h.4.2.z.2.1.r.f.i.3.4.1.1.v.3.1.s.d.k.5.5.r.1.2.1.2.t.b.k.7.6.p.2.2.v.b.k.12.10.5.4.1.j.13.11.4.n.14.12.3.2.1.1.2.h.m.3.d.14.6.4.1.f.m.4.4.2.4.18.5.j.l.5.3.3.4.3.2.16.2.j.j.7.2.5.4.3.1.17.1.2.4.d.k.7.1.5.1.1.1.4.1.18.7.d.j.8.1.4.1.6.2.18.8.c.3.1.d.e.2.3.1.1b.9.g.c.e.2.2.2.1a.b.f.a.h.1.1.5.2.1.15.d.e.9.h.2.1.4.2.4.13.d.d.9.i.3.7.3.12.d.e.8.k.1.7.3.12.c.f.8.q.1.2.1.14.b.e.9.1.2.l.4.1.1.15.a.e.8.1.3.k.7.15.a.f.6.2.2.k.9.14.9.g.6.2.2.j.b.13.7.i.6.n.b.13.7.j.4.o.c.12.6.k.4.o.b.13.6.k.1.r.2.4.5.13.5.1k.3.7.1.v.4.1o.1.7.1.v.4.1o.1.6.1.w.3.1v.1.x.3.2t.2.2v.2.1z";

  var bits = '', on = false;
  ENC.split('.').forEach(function (t) {
    var n = parseInt(t, 36);
    if (n > 0) bits += (on ? '1' : '0').repeat(n);
    on = !on;
  });
  while (bits.length < COLS * ROWS) bits += '0';

  var rows = [];
  for (var r = 0; r < ROWS; r++) {
    rows.push(bits.substr(r * COLS, COLS).replace(/1/g, '#').replace(/0/g, '.'));
  }
  window.__NXT_WORLD_MASK__ = rows;
})();
