--
-- PostgreSQL database dump
--

\restrict 2LGgLC2KYdQYXHFohuNbL5CzbrZ4njifZ0v7q0kVb9ymIUAxKHwPTiCBmQ9CBTO

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
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
-- Name: cars id; Type: DEFAULT; Schema: public; Owner: caruser
--

ALTER TABLE ONLY public.cars ALTER COLUMN id SET DEFAULT nextval('public.cars_id_seq'::regclass);


--
-- Data for Name: cars; Type: TABLE DATA; Schema: public; Owner: caruser
--

COPY public.cars (id, name, price, year, mileage, image, featured, description, engine, transmission, fuel, created_at) FROM stdin;
1	Mercedes-Benz S-Class	95000	2023	5000	https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop	t	Luxury sedan with cutting-edge technology and comfort	3.0L V6	Automatic	Gasoline	2025-10-06 19:22:49.455737
2	BMW M4 Competition	78000	2023	3000	https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop	t	High-performance sports coupe with racing DNA	3.0L Twin-Turbo I6	Automatic	Gasoline	2025-10-06 19:22:49.455737
3	Audi e-tron GT	105000	2023	2000	https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&h=600&fit=crop	f	Electric gran turismo combining performance and sustainability	Electric	Automatic	Electric	2025-10-06 19:22:49.455737
4	Porsche 911 Carrera	115000	2023	4000	https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop	t	Iconic sports car with timeless design	3.0L Twin-Turbo Flat-6	PDK	Gasoline	2025-10-06 19:22:49.455737
5	Tesla Model S Plaid	89000	2023	6000	https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop	f	Fastest accelerating production car with autopilot	Electric Tri-Motor	Single-Speed	Electric	2025-10-06 19:22:49.455737
6	Range Rover Sport	92000	2023	7000	https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop	f	Luxury SUV with exceptional off-road capability	3.0L Supercharged V6	Automatic	Gasoline	2025-10-06 19:22:49.455737
\.


--
-- Name: cars_id_seq; Type: SEQUENCE SET; Schema: public; Owner: caruser
--

SELECT pg_catalog.setval('public.cars_id_seq', 6, true);


--
-- Name: cars cars_pkey; Type: CONSTRAINT; Schema: public; Owner: caruser
--

ALTER TABLE ONLY public.cars
    ADD CONSTRAINT cars_pkey PRIMARY KEY (id);


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
-- PostgreSQL database dump complete
--

\unrestrict 2LGgLC2KYdQYXHFohuNbL5CzbrZ4njifZ0v7q0kVb9ymIUAxKHwPTiCBmQ9CBTO

