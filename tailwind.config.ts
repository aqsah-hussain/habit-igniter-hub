import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					hover: 'hsl(var(--primary-hover))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				ignite: {
					start: 'hsl(var(--ignite-start))',
					middle: 'hsl(var(--ignite-middle))',
					end: 'hsl(var(--ignite-end))'
				},
				fire: {
					orange: 'hsl(var(--fire-orange))',
					red: 'hsl(var(--fire-red))',
					yellow: 'hsl(var(--fire-yellow))'
				},
				success: {
					start: 'hsl(var(--success-start))',
					end: 'hsl(var(--success-end))'
				},
				achievement: 'hsl(var(--achievement-gold))',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'gradient-ignite': 'var(--gradient-ignite)',
				'gradient-fire': 'var(--gradient-fire)',
				'gradient-success': 'var(--gradient-success)',
				'gradient-glass': 'var(--gradient-glass)'
			},
			boxShadow: {
				'ignite': 'var(--shadow-ignite)',
				'success': 'var(--shadow-success)',
				'glass': 'var(--shadow-glass)'
			},
			transitionTimingFunction: {
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
				'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'ignite-pulse': {
					'0%, 100%': { 
						transform: 'scale(1)',
						boxShadow: '0 0 0 0 hsl(var(--ignite-start) / 0.7)'
					},
					'50%': { 
						transform: 'scale(1.05)',
						boxShadow: '0 0 0 10px hsl(var(--ignite-start) / 0)'
					}
				},
				'success-bounce': {
					'0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
					'40%': { transform: 'translateY(-10px)' },
					'60%': { transform: 'translateY(-5px)' }
				},
				'fire-flicker': {
					'0%, 100%': { transform: 'rotate(-1deg) scale(1)' },
					'25%': { transform: 'rotate(1deg) scale(1.05)' },
					'50%': { transform: 'rotate(-0.5deg) scale(0.95)' },
					'75%': { transform: 'rotate(0.5deg) scale(1.02)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'ignite-pulse': 'ignite-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'success-bounce': 'success-bounce 1s ease-in-out',
				'fire-flicker': 'fire-flicker 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
