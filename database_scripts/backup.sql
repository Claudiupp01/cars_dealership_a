--
-- PostgreSQL database dump
--

\restrict cNXjP9k8ePcvLQNV1VNxEEHJ1IyS4cjBenx6cQII8sPB5dxhVJFMAJ5IKfTIdun

-- Dumped from database version 15.14
-- Dumped by pg_dump version 15.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: caruser
--

CREATE TYPE public.user_role AS ENUM (
    'user',
    'admin',
    'owner'
);


ALTER TYPE public.user_role OWNER TO caruser;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cars; Type: TABLE; Schema: public; Owner: caruser
--

CREATE TABLE public.cars (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    price integer NOT NULL,
    year integer NOT NULL,
    mileage integer NOT NULL,
    image character varying(500),
    featured boolean DEFAULT false,
    description text,
    engine character varying(100),
    transmission character varying(100),
    fuel character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    color character varying(50)
);


ALTER TABLE public.cars OWNER TO caruser;

--
-- Name: cars_id_seq; Type: SEQUENCE; Schema: public; Owner: caruser
--

CREATE SEQUENCE public.cars_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cars_id_seq OWNER TO caruser;

--
-- Name: cars_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: caruser
--

ALTER SEQUENCE public.cars_id_seq OWNED BY public.cars.id;


--
-- Name: contact_inquiries; Type: TABLE; Schema: public; Owner: caruser
--

CREATE TABLE public.contact_inquiries (
    id integer NOT NULL,
    user_id integer,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50),
    subject character varying(255),
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contact_inquiries OWNER TO caruser;

--
-- Name: contact_inquiries_id_seq; Type: SEQUENCE; Schema: public; Owner: caruser
--

CREATE SEQUENCE public.contact_inquiries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contact_inquiries_id_seq OWNER TO caruser;

--
-- Name: contact_inquiries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: caruser
--

ALTER SEQUENCE public.contact_inquiries_id_seq OWNED BY public.contact_inquiries.id;


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: caruser
--

CREATE TABLE public.favorites (
    id integer NOT NULL,
    user_id integer NOT NULL,
    car_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.favorites OWNER TO caruser;

--
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: caruser
--

CREATE SEQUENCE public.favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.favorites_id_seq OWNER TO caruser;

--
-- Name: favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: caruser
--

ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;


--
-- Name: test_drives; Type: TABLE; Schema: public; Owner: caruser
--

CREATE TABLE public.test_drives (
    id integer NOT NULL,
    user_id integer NOT NULL,
    car_id integer NOT NULL,
    preferred_date character varying(100),
    preferred_time character varying(100),
    phone character varying(50),
    message text,
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.test_drives OWNER TO caruser;

--
-- Name: test_drives_id_seq; Type: SEQUENCE; Schema: public; Owner: caruser
--

CREATE SEQUENCE public.test_drives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.test_drives_id_seq OWNER TO caruser;

--
-- Name: test_drives_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: caruser
--

ALTER SEQUENCE public.test_drives_id_seq OWNED BY public.test_drives.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: caruser
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    username character varying(100) NOT NULL,
    hashed_password character varying(255) NOT NULL,
    full_name character varying(255),
    role character varying(50) DEFAULT 'user'::character varying NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO caruser;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: caruser
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO caruser;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: caruser
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cars id; Type: DEFAULT; Schema: public; Owner: caruser
--

ALTER TABLE ONLY public.cars ALTER COLUMN id SET DEFAULT nextval('public.cars_id_seq'::regclass);


--
-- Name: contact_inquiries id; Type: DEFAULT; Schema: public; Owner: caruser
--

ALTER TABLE ONLY public.contact_inquiries ALTER COLUMN id SET DEFAULT nextval('public.contact_inquiries_id_seq'::regclass);


--
-- Name: favorites id; Type: DEFAULT; Schema: public; Owner: caruser
--

ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);


--
-- Name: test_drives id; Type: DEFAULT; Schema: public; Owner: caruser
--

ALTER TABLE ONLY public.test_drives ALTER COLUMN id SET DEFAULT nextval('public.test_drives_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: caruser
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cars; Type: TABLE DATA; Schema: public; Owner: caruser
--

COPY public.cars (id, name, price, year, mileage, image, featured, description, engine, transmission, fuel, created_at, color) FROM stdin;
1	Mercedes-Benz S-Class	95000	2023	5000	https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800	t	Luxury sedan with cutting-edge technology and comfort	3.0L V6	Automatic	Gasoline	2025-10-20 10:36:50.963104	White
4	Mercedes-Benz S-Class	95000	2023	5000	https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800	t	Luxury sedan with cutting-edge technology and comfort	3.0L V6	Automatic	Gasoline	2025-10-20 11:18:20.356442	Red
5	Mercedes-Benz GLE SUV	72000	2022	15000	https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800	f	Spacious luxury SUV with advanced safety features	2.0L Turbo I4	Automatic	Gasoline	2025-10-20 11:18:20.356442	Gray
6	Mercedes-Benz AMG GT	135000	2024	1200	https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800	t	High-performance sports car with race-inspired engineering	4.0L Twin-Turbo V8	Automatic	Gasoline	2025-10-20 11:18:20.356442	Black
2	BMW M4 Competition	78000	2023	3000	https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800	t	High-performance sports coupe with racing DNA	3.0L Twin-Turbo I6	Automatic	Gasoline	2025-10-20 10:36:50.963104	Silver
7	BMW M4 Competition	78000	2023	3000	https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800	t	High-performance sports coupe with racing DNA	3.0L Twin-Turbo I6	Automatic	Gasoline	2025-10-20 11:18:20.356442	White
8	BMW X5 xDrive40i	65000	2022	18000	https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800	f	Premium mid-size SUV with exceptional handling	3.0L Turbo I6	Automatic	Gasoline	2025-10-20 11:18:20.356442	Silver
9	BMW i4 eDrive40	58000	2023	8000	https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800	f	Electric sports sedan with 300+ miles range	Electric Motor	Single-Speed	Electric	2025-10-20 11:18:20.356442	Blue
10	BMW 330i	45000	2021	25000	https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800	f	Compact luxury sedan with sporty performance	2.0L Turbo I4	Automatic	Gasoline	2025-10-20 11:18:20.356442	Red
11	Audi e-tron GT	105000	2023	2000	https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800	t	Electric gran turismo combining performance and sustainability	Electric Twin Motor	Single-Speed	Electric	2025-10-20 11:18:20.356442	Gray
12	Audi A8 L	88000	2023	7500	https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800	f	Full-size luxury sedan with advanced autonomous features	3.0L Turbo V6	Automatic	Gasoline	2025-10-20 11:18:20.356442	Black
13	Audi Q7 Premium Plus	62000	2022	12000	https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800	f	Three-row luxury SUV perfect for families	2.0L Turbo I4	Automatic	Gasoline	2025-10-20 11:18:20.356442	White
3	Porsche 911 Carrera	115000	2023	4000	https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800	t	Iconic sports car with timeless design	3.0L Twin-Turbo Flat-6	PDK	Gasoline	2025-10-20 10:36:50.963104	Blue
14	Porsche 911 Carrera	115000	2023	4000	https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800	t	Iconic sports car with timeless design	3.0L Twin-Turbo Flat-6	PDK	Gasoline	2025-10-20 11:18:20.356442	Silver
15	Porsche Taycan 4S	108000	2024	1500	https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800	t	Electric sports sedan with blistering acceleration	Electric Dual Motor	Single-Speed	Electric	2025-10-20 11:18:20.356442	Blue
16	Porsche Cayenne	75000	2022	14000	https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800	f	Luxury SUV with sports car performance	3.0L Turbo V6	Automatic	Gasoline	2025-10-20 11:18:20.356442	Red
17	Porsche Macan S	63000	2023	9000	https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800	f	Compact luxury SUV with agile handling	2.9L Twin-Turbo V6	PDK	Gasoline	2025-10-20 11:18:20.356442	Gray
18	Tesla Model S Plaid	89000	2023	6000	https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800	t	Fastest accelerating production car with autopilot	Electric Tri-Motor	Single-Speed	Electric	2025-10-20 11:18:20.356442	Black
19	Tesla Model 3 Performance	58000	2023	11000	https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800	f	Affordable electric sedan with impressive performance	Electric Dual Motor	Single-Speed	Electric	2025-10-20 11:18:20.356442	White
20	Tesla Model X Long Range	98000	2024	3000	https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800	f	Electric SUV with falcon-wing doors and 7 seats	Electric Dual Motor	Single-Speed	Electric	2025-10-20 11:18:20.356442	Silver
21	Tesla Model Y	52000	2023	15000	https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800	f	Compact electric SUV with great efficiency	Electric Dual Motor	Single-Speed	Electric	2025-10-20 11:18:20.356442	Blue
22	Range Rover Sport	92000	2023	7000	https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800	f	Luxury SUV with exceptional off-road capability	3.0L Supercharged V6	Automatic	Gasoline	2025-10-20 11:18:20.356442	Red
23	Range Rover Velar	68000	2022	16000	https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800	f	Sleek mid-size luxury SUV with modern design	2.0L Turbo I4	Automatic	Gasoline	2025-10-20 11:18:20.356442	Gray
24	Lexus LS 500	78000	2023	8500	https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800	f	Japanese luxury sedan with legendary reliability	3.5L Twin-Turbo V6	Automatic	Gasoline	2025-10-20 11:18:20.356442	Black
25	Lexus RX 450h	55000	2022	22000	https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800	f	Hybrid luxury SUV with excellent fuel economy	3.5L V6 Hybrid	CVT	Hybrid	2025-10-20 11:18:20.356442	White
26	Jaguar F-Type R	102000	2023	5500	https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800	f	British sports car with supercharged power	5.0L Supercharged V8	Automatic	Gasoline	2025-10-20 11:18:20.356442	Silver
27	Jaguar I-PACE	72000	2023	9500	https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800	f	Electric luxury SUV with British elegance	Electric Dual Motor	Single-Speed	Electric	2025-10-20 11:18:20.356442	Blue
28	Maserati Quattroporte	95000	2022	12000	https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800	f	Italian luxury sedan with V8 power	3.8L Twin-Turbo V8	Automatic	Gasoline	2025-10-20 11:18:20.356442	Red
29	Maserati Levante	82000	2023	8000	https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800	f	Italian luxury SUV with sporty character	3.0L Twin-Turbo V6	Automatic	Gasoline	2025-10-20 11:18:20.356442	Gray
30	Bentley Continental GT	225000	2024	1000	https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800	t	Grand touring luxury with impeccable craftsmanship	6.0L Twin-Turbo W12	Automatic	Gasoline	2025-10-20 11:18:20.356442	Black
31	Lamborghini Huracán EVO	275000	2023	2500	https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800	t	Italian exotic supercar with V10 power	5.2L V10	Automatic	Gasoline	2025-10-20 11:18:20.356442	White
32	Ferrari F8 Tributo	290000	2023	1800	https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800	t	Mid-engine Italian masterpiece	3.9L Twin-Turbo V8	Automatic	Gasoline	2025-10-20 11:18:20.356442	Silver
\.


--
-- Data for Name: contact_inquiries; Type: TABLE DATA; Schema: public; Owner: caruser
--

COPY public.contact_inquiries (id, user_id, name, email, phone, subject, message, created_at) FROM stdin;
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: caruser
--

COPY public.favorites (id, user_id, car_id, created_at) FROM stdin;
2	2	1	2025-10-20 10:55:18.017997
3	2	32	2025-10-20 12:13:03.075379
4	2	31	2025-10-20 12:13:04.175364
5	2	30	2025-10-20 12:13:05.241036
6	2	29	2025-10-20 12:13:11.132903
7	2	28	2025-10-20 12:13:14.04876
\.


--
-- Data for Name: test_drives; Type: TABLE DATA; Schema: public; Owner: caruser
--

COPY public.test_drives (id, user_id, car_id, preferred_date, preferred_time, phone, message, status, created_at) FROM stdin;
1	2	32	2025-11-01	10:00 AM	0772 022 772	I really love this car.\n\nHope we can meet.\n\nPlease respond to me if the hour and the appointment is not ok.	approved	2025-10-20 12:14:14.447916
2	2	2	2025-12-01	4:00 PM	0777222333	Hello sir!	cancelled	2025-10-20 21:02:31.953263
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: caruser
--

COPY public.users (id, email, username, hashed_password, full_name, role, is_active, created_at) FROM stdin;
2	user@gmail.com	user	$2b$12$42UfnySMDRYgLZSE07BOGeFA4tAgwGaSCWGtN6sy2jq5aoDUkQqW.	user	user	t	2025-10-20 10:43:39.274003
1	admin@elitemotors.com	admin	$2b$12$wsrwakP2JSqgDxHbPVVHb.n3FEWjdA3R7E.bwXPA5IHbc0NeGOydW	admin	admin	t	2025-10-20 10:43:24.857211
3	owner@elitemotors.com	owner	$2b$12$8ITM8cgPAn79zNhhButAtuAKrSsQ1nJ8fEHIQFhwpscHWwTRiPtFK	owner	owner	t	2025-10-20 10:43:58.950132
4	asd@gmail.com	asd	$2b$12$et4T/dC5cVJICI9yVrqD1u0EfpLqHu/iKbC.KtBHChtQbbNvjRhZy	asd	user	t	2025-10-20 21:24:15.54693
5	john@example.com	johndoe	$2b$12$.09Mv4NHJLiVgGyaHnzf1OXJUR2PXuLBHnIjwAA2uXAJZsx9OFaZK	John Doe	user	t	2025-10-20 21:27:49.276502
\.


--
-- Name: cars_id_seq; Type: SEQUENCE SET; Schema: public; Owner: caruser
--

SELECT pg_catalog.setval('public.cars_id_seq', 32, true);


--
-- Name: contact_inquiries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: caruser
--

SELECT pg_catalog.setval('public.contact_inquiries_id_seq', 1, false);


--
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: caruser
--

SELECT pg_catalog.setval('public.favorites_id_seq', 7, true);


--
-- Name: test_drives_id_seq; Type: SEQUENCE SET; Schema: public; Owner: caruser
--

SELECT pg_catalog.setval('public.test_drives_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: caruser
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- Name: cars cars_pkey; Type: CONSTRAINT; Schema: public; Owner: caruser
--

ALTER TABLE ONLY public.cars
    ADD CONSTRAINT cars_pkey PRIMARY KEY (id);


--
-- Name: contact_inquiries contact_inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: caruser
--

ALTER TABLE ONLY public.contact_inquiries
    ADD CONSTRAINT contact_inquiries_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: caruser
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_user_id_car_id_key; Type: CONSTRAINT; Schema: public; Owner: caruser
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_car_id_key UNIQUE (user_id, car_id);


--
-- Name: test_drives test_drives_pkey; Type: CONSTRAINT; Schema: public; Owner: caruser
--

ALTER TABLE ONLY public.test_drives
    ADD CONSTRAINT test_drives_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: caruser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: caruser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: caruser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_cars_color; Type: INDEX; Schema: public; Owner: caruser
--

CREATE INDEX idx_cars_color ON public.cars USING btree (color);


--
-- Name: idx_cars_featured; Type: INDEX; Schema: public; Owner: caruser
--

CREATE INDEX idx_cars_featured ON public.cars USING btree (featured);


--
-- Name: idx_cars_price; Type: INDEX; Schema: public; Owner: caruser
--

CREATE INDEX idx_cars_price ON public.cars USING btree (price);


--
-- Name: idx_cars_year; Type: INDEX; Schema: public; Owner: caruser
--

CREATE INDEX idx_cars_year ON public.cars USING btree (year);


--
-- Name: idx_contact_inquiries_user; Type: INDEX; Schema: public; Owner: caruser
--

CREATE INDEX idx_contact_inquiries_user ON public.contact_inquiries USING btree (user_id);


--
-- Name: idx_favorites_car; Type: INDEX; Schema: public; Owner: caruser
--

CREATE INDEX idx_favorites_car ON public.favorites USING btree (car_id);


--
-- Name: idx_favorites_user; Type: INDEX; Schema: public; Owner: caruser
--

CREATE INDEX idx_favorites_user ON public.favorites USING btree (user_id);


--
-- Name: idx_test_drives_status; Type: INDEX; Schema: public; Owner: caruser
--

CREATE INDEX idx_test_drives_status ON public.test_drives USING btree (status);


--
-- Name: idx_test_drives_user; Type: INDEX; Schema: public; Owner: caruser
--

CREATE INDEX idx_test_drives_user ON public.test_drives USING btree (user_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: caruser
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: caruser
--

CREATE INDEX idx_users_username ON public.users USING btree (username);


--
-- Name: contact_inquiries contact_inquiries_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: caruser
--

ALTER TABLE ONLY public.contact_inquiries
    ADD CONSTRAINT contact_inquiries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: favorites favorites_car_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: caruser
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_car_id_fkey FOREIGN KEY (car_id) REFERENCES public.cars(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: caruser
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: test_drives test_drives_car_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: caruser
--

ALTER TABLE ONLY public.test_drives
    ADD CONSTRAINT test_drives_car_id_fkey FOREIGN KEY (car_id) REFERENCES public.cars(id) ON DELETE CASCADE;


--
-- Name: test_drives test_drives_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: caruser
--

ALTER TABLE ONLY public.test_drives
    ADD CONSTRAINT test_drives_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict cNXjP9k8ePcvLQNV1VNxEEHJ1IyS4cjBenx6cQII8sPB5dxhVJFMAJ5IKfTIdun

