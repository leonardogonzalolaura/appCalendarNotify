import React from 'react';
import { motion } from 'framer-motion';
import { format, isSameDay, startOfDay, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Clock, CheckCircle2, ListTodo, AlertCircle, Plus,
  CalendarDays, BellRing, Zap, Sunrise, Sunset, Moon,
  ArrowRight, Sparkles, TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const Dashboard = ({ user, onAddActivity }) => {
  const { activities, settings, characters } = useApp();
  const today = startOfDay(new Date());

  const todayActivities = activities.filter(a => isSameDay(startOfDay(new Date(a.date)), today));
  const pendingToday = todayActivities.filter(a => a.status === 'pending');
  const completedToday = todayActivities.filter(a => a.status === 'completed');
  const missedToday = todayActivities.filter(a => a.status === 'missed');
  const totalToday = todayActivities.length;
  const progress = totalToday > 0 ? Math.round((completedToday.length / totalToday) * 100) : 0;

  const upcomingActivities = activities
    .filter(a => a.status === 'pending' && isAfter(startOfDay(new Date(a.date)), today))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4);

  const hour = new Date().getHours();
  let greeting = 'Buenas noches';
  let GreetingIcon = Moon;
  if (hour < 12) { greeting = 'Buenos días'; GreetingIcon = Sunrise; }
  else if (hour < 19) { greeting = 'Buenas tardes'; GreetingIcon = Sunset; }

  const userName = user?.name?.split(' ')[0] || 'Usuario';
  const calendarColor = settings?.calendarColor || '#6366f1';
  const character = characters.find(c => c.id === settings?.popupCharacter) || characters[0];
  const sortedToday = [...todayActivities].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* ── Hero ── */}
      <motion.div variants={item} initial="hidden" animate="show">
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '1.5rem',
            padding: '1.5rem',
            color: 'white',
            background: `linear-gradient(135deg, ${calendarColor}, ${calendarColor}dd, ${calendarColor}88)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0, right: 0,
              width: '16rem', height: '16rem',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '9999px',
              transform: 'translateY(-50%) translateX(33%)',
              filter: 'blur(64px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0, left: 0,
              width: '12rem', height: '12rem',
              background: 'rgba(0,0,0,0.1)',
              borderRadius: '9999px',
              transform: 'translateY(33%) translateX(-25%)',
              filter: 'blur(64px)',
            }}
          />

          <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>
                <GreetingIcon size={18} />
                <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{greeting}</span>
              </div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 900, marginBottom: '0.5rem', lineHeight: 1.1 }}>
                {userName}
              </h1>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                <CalendarDays size={16} />
                {format(today, "eeee, d 'de' MMMM", { locale: es })}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  onClick={onAddActivity}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 900,
                    borderRadius: '1rem',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.35)',
                    background: 'rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(12px)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.35)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
                >
                  <Plus size={20} />
                  Nueva Actividad
                </button>
                {totalToday > 0 && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(8px)',
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  >
                    <Zap size={14} />
                    {progress}% completado
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flexShrink: 0, marginLeft: '2rem' }}>
              <div
                style={{
                  width: '5rem', height: '5rem',
                  borderRadius: '1.5rem',
                  padding: '0.5rem',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                }}
              >
                <img src={character.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.75)' }}>{character.name}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Stats ── */}
      <motion.div variants={item} initial="hidden" animate="show">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div style={{ borderRadius: '1.5rem', padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.1)' }}>
                <Clock size={20} style={{ color: 'var(--primary)' }} />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)' }}>Pendientes</span>
            </div>
            <p style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1rem' }}>{pendingToday.length}</p>
            <div style={{ height: '0.5rem', borderRadius: '9999px', overflow: 'hidden', background: 'rgba(99,102,241,0.1)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${totalToday > 0 ? (pendingToday.length / totalToday) * 100 : 0}%` }}
                style={{ height: '100%', borderRadius: '9999px', background: 'var(--primary)' }}
              />
            </div>
          </div>

          <div style={{ borderRadius: '1.5rem', padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0fdf4' }}>
                <CheckCircle2 size={20} style={{ color: '#22c55e' }} />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)' }}>Completadas</span>
            </div>
            <p style={{ fontSize: '2.25rem', fontWeight: 900, color: '#22c55e', marginBottom: '1rem' }}>{completedToday.length}</p>
            <div style={{ height: '0.5rem', borderRadius: '9999px', overflow: 'hidden', background: '#dcfce7' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${totalToday > 0 ? (completedToday.length / totalToday) * 100 : 0}%` }}
                style={{ height: '100%', borderRadius: '9999px', background: '#22c55e' }}
              />
            </div>
          </div>

          <div style={{ borderRadius: '1.5rem', padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff7ed' }}>
                <ListTodo size={20} style={{ color: '#f97316' }} />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)' }}>Total</span>
            </div>
            <p style={{ fontSize: '2.25rem', fontWeight: 900, color: '#f97316', marginBottom: '1rem' }}>{totalToday}</p>
            <div style={{ height: '0.5rem', borderRadius: '9999px', overflow: 'hidden', background: '#ffedd5' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                style={{ height: '100%', borderRadius: '9999px', background: '#f97316' }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Actividades de Hoy ── */}
      <motion.div variants={item} initial="hidden" animate="show">
        <div style={{ borderRadius: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 1.5rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.1)' }}>
                <Sparkles size={20} style={{ color: 'var(--primary)' }} />
              </div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 900 }}>Actividades de Hoy</h2>
            </div>
            {pendingToday.length > 0 && (
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>
                {pendingToday.length} {pendingToday.length === 1 ? 'pendiente' : 'pendientes'}
              </span>
            )}
          </div>

          {sortedToday.length === 0 ? (
            <div style={{ padding: '1.5rem 1.5rem 3rem', textAlign: 'center' }}>
              <div style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(236,72,153,0.05))' }}>
                <BellRing size={28} style={{ color: 'var(--primary)', opacity: 0.4 }} />
              </div>
              <p style={{ fontWeight: 900, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Sin actividades hoy</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', opacity: 0.5 }}>Tu día está libre. ¡Aprovecha para planificar!</p>
            </div>
          ) : (
            <div style={{ padding: '0 1.5rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {sortedToday.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    transition: 'all 0.2s',
                    border: '1px solid transparent',
                    opacity: activity.status === 'completed' ? 0.6 : 1,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--background)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div
                    style={{
                      width: '2.75rem',
                      height: '2.75rem',
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: 900,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      background: activity.status === 'completed' ? '#22c55e' : activity.status === 'missed' ? '#ef4444' : calendarColor,
                    }}
                  >
                    {format(new Date(activity.date), 'HH')}<span style={{ fontSize: '0.625rem', opacity: 0.7 }}>h</span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 900,
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        textDecoration: activity.status === 'completed' ? 'line-through' : 'none',
                        color: activity.status === 'completed' ? 'var(--text-muted)' : 'var(--text)',
                      }}
                    >
                      {activity.title}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.125rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', opacity: 0.6 }}>
                        {format(new Date(activity.date), 'HH:mm')}
                      </span>
                      {activity.description && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.35, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                          {activity.description}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    {activity.status === 'pending' && (
                      <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '0.25rem 0.625rem', borderRadius: '9999px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        Pendiente
                      </span>
                    )}
                    {activity.status === 'completed' && (
                      <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '0.25rem 0.625rem', borderRadius: '9999px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                        <CheckCircle2 size={10} style={{ display: 'inline', marginRight: '0.125rem', marginTop: '-0.125rem' }} />
                        Hecha
                      </span>
                    )}
                    {activity.status === 'missed' && (
                      <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '0.25rem 0.625rem', borderRadius: '9999px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }}>
                        Perdida
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Próximas ── */}
      {upcomingActivities.length > 0 && (
        <motion.div variants={item} initial="hidden" animate="show">
          <div style={{ borderRadius: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.5rem 1.5rem 1rem' }}>
              <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.1)' }}>
                <TrendingUp size={20} style={{ color: 'var(--primary)' }} />
              </div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 900 }}>Próximas Actividades</h2>
            </div>
            <div style={{ padding: '0 1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {upcomingActivities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    transition: 'all 0.2s',
                    border: '1px solid transparent',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--background)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '3rem', flexShrink: 0 }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, lineHeight: 1, color: calendarColor }}>
                      {format(new Date(activity.date), 'd')}
                    </span>
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.2, color: 'var(--text-muted)' }}>
                      {format(new Date(activity.date), 'MMM', { locale: es })}
                    </span>
                  </div>
                  <div style={{ width: '1px', height: '2.5rem', background: 'var(--border)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 900, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {activity.title}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.6 }}>
                      {format(new Date(activity.date), 'EEEE', { locale: es })} • {format(new Date(activity.date), 'HH:mm')}
                    </span>
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--text-muted)', opacity: 0.2, flexShrink: 0 }} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Missed ── */}
      {missedToday.length > 0 && (
        <motion.div variants={item} initial="hidden" animate="show">
          <div
            style={{
              borderRadius: '1.5rem',
              padding: '1.5rem',
              border: '1px solid rgba(239,68,68,0.15)',
              background: 'rgba(239,68,68,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertCircle size={20} style={{ color: '#ef4444' }} />
              </div>
              <div>
                <h3 style={{ fontWeight: 900, fontSize: '0.875rem', color: '#dc2626', marginBottom: '0.125rem' }}>
                  {missedToday.length} {missedToday.length === 1 ? 'actividad perdida' : 'actividades perdidas'}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.7 }}>
                  {missedToday.length === 1
                    ? 'No se pudo completar a tiempo. Visita el calendario para reprogramarla.'
                    : 'No se pudieron completar a tiempo. Visita el calendario para reprogramarlas.'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default Dashboard;
