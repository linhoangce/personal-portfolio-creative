"use client";

import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import React, { useEffect, useRef } from "react";
import { MdCircle } from "react-icons/md";
import { gsap } from "gsap/gsap-core";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Props for `TechList`.
 */
export type TechListProps = SliceComponentProps<Content.TechListSlice>;

/**
 * Component for "TechList" Slices.
 */
const TechList = ({ slice }: TechListProps): JSX.Element => {
	const component = useRef(null);

	useEffect(() => {
		let ctx = gsap.context(() => {
			const tl = gsap.timeline({
				scrollTrigger: {
          trigger: component.current,
					start: "top bottom",
					end: "bottom top",
					scrub: 6,
				},
			});

			tl.fromTo(
				".tech-row",
				{
					x: (index) => {
						return index % 2 === 0
							? gsap.utils.random(600, 400)
							: gsap.utils.random(-600, -400);
					},
				},
				{
					x: (index) => {
						return index % 2 === 0
							? gsap.utils.random(-600, -400)
							: gsap.utils.random(600, 400);
					},
          ease: "power1.inOut"
				}, 
			);
		}, component);
		return () => ctx.revert(); // Clean up
	});
	return (
		<section
			data-slice-type={slice.slice_type}
			data-slice-variation={slice.variation}
			className="overflow-hidden"
			ref={component}
		>
			<Bounded>
				<Heading
					size="xl"
					as="h2"
					className="mb-8"
				>
					{slice.primary.heading}
				</Heading>
			</Bounded>
			{slice.primary.tech_name.map((item, index) => (
				<div
					key={index}
					className="tech-row mb-8 flex items-center justify-center gap-4 text-slate-700"
					aria-label={item.tech_name || undefined}
				>
					{Array.from({ length: 15 }, (_, index) => (
						<React.Fragment key={index}>
							<span
								className="tech_name text-8xl font-extrabold uppercase tracking-tighter"
								style={{
									color:
										index === 7 && item.tech_color
											? item.tech_color
											: "inherit",
								}}
							>
								{item.tech_name}
							</span>
							<span className="text-3xl">
								<MdCircle />
							</span>
						</React.Fragment>
					))}
				</div>
			))}
		</section>
	);
};

export default TechList;
