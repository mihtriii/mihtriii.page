import React from 'react';
import { motion } from 'framer-motion';

const icons = [
	{ name: 'GitHub', icon: <i className="bi bi-github"></i>, url: 'https://github.com/mihtriii', color: '#181717' },
	{ name: 'LinkedIn', icon: <i className="bi bi-linkedin"></i>, url: 'https://www.linkedin.com/in/mihtriii/', color: '#0a66c2' },
	{ name: 'Kaggle', icon: <img src={import.meta.env.BASE_URL + 'assets/kaggle.svg'} alt="Kaggle" width={18} height={18} />, url: 'https://www.kaggle.com/mihtriii', color: '#20beff' },
	{ name: 'Email', icon: <i className="bi bi-envelope"></i>, url: 'mailto:mihtriii295@gmail.com', color: '#c97a40' },
	{ name: 'Scholar', icon: <i className="bi bi-mortarboard"></i>, url: 'https://scholar.google.com/citations?user=YOUR_PROFILE_ID', color: '#4285f4' },
];

export default function SidebarIcons() {
	return (
		<div className="sidebar-icons d-flex flex-column gap-2 align-items-center" style={{ minHeight: 220 }}>
			{icons.map((item, i) => (
				<motion.a
					key={item.name}
					href={item.url}
					target="_blank"
					rel="noopener noreferrer"
					className="icon-btn"
					title={item.name}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 * i, type: 'spring', stiffness: 300 }}
					whileHover={{ scale: 1.18, boxShadow: `0 2px 12px ${item.color}33` }}
					whileTap={{ scale: 0.95 }}
					style={{ color: item.color, background: 'var(--surface-2)' }}
				>
					{item.icon}
				</motion.a>
			))}
		</div>
	);
}
