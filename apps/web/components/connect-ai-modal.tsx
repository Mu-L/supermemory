"use client";

import { $fetch } from "@lib/api";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@ui/components/dialog";
import { Input } from "@ui/components/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import { CopyableCell } from "@ui/copyable-cell";
import { CopyIcon, ExternalLink, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod/v4";
import { analytics } from "@/lib/analytics";

const clients = {
	cursor: "Cursor",
	claude: "Claude Desktop",
	vscode: "VSCode",
	cline: "Cline",
	"gemini-cli": "Gemini CLI",
	"claude-code": "Claude Code",
	"mcp-url": "MCP URL",
	"roo-cline": "Roo Cline",
	witsy: "Witsy",
	enconvo: "Enconvo",
} as const;

const mcpMigrationSchema = z.object({
	url: z
		.string()
		.min(1, "MCP Link is required")
		.regex(
			/^https:\/\/mcp\.supermemory\.ai\/[^/]+\/sse$/,
			"Link must be in format: https://mcp.supermemory.ai/userId/sse",
		),
});

interface Project {
	id: string;
	name: string;
	containerTag: string;
	createdAt: string;
	updatedAt: string;
	isExperimental?: boolean;
}

interface ConnectAIModalProps {
	children: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function ConnectAIModal({
	children,
	open,
	onOpenChange,
}: ConnectAIModalProps) {
	const [selectedClient, setSelectedClient] = useState<
		keyof typeof clients | null
	>(null);
	const [internalIsOpen, setInternalIsOpen] = useState(false);
	const isOpen = open !== undefined ? open : internalIsOpen;
	const setIsOpen = onOpenChange || setInternalIsOpen;
	const [isMigrateDialogOpen, setIsMigrateDialogOpen] = useState(false);
	const [selectedProject, setSelectedProject] = useState<string | null>("none");
	const projectId = localStorage.getItem("selectedProject") ?? "default";

	useEffect(() => {
		analytics.mcpViewOpened();
	}, []);

	const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
		queryKey: ["projects"],
		queryFn: async () => {
			const response = await $fetch("@get/projects");
			if (response.error) {
				throw new Error(response.error?.message || "Failed to load projects");
			}
			return response.data?.projects || [];
		},
		staleTime: 30 * 1000,
	});

	const mcpMigrationForm = useForm({
		defaultValues: { url: "" },
		onSubmit: async ({ value, formApi }) => {
			const userId = extractUserIdFromMCPUrl(value.url);
			if (userId) {
				migrateMCPMutation.mutate({ userId, projectId });
				formApi.reset();
			}
		},
		validators: {
			onChange: mcpMigrationSchema,
		},
	});

	const extractUserIdFromMCPUrl = (url: string): string | null => {
		const regex = /^https:\/\/mcp\.supermemory\.ai\/([^/]+)\/sse$/;
		const match = url.trim().match(regex);
		return match?.[1] || null;
	};

	const migrateMCPMutation = useMutation({
		mutationFn: async ({
			userId,
			projectId,
		}: {
			userId: string;
			projectId: string;
		}) => {
			const response = await $fetch("@post/memories/migrate-mcp", {
				body: { userId, projectId },
			});

			if (response.error) {
				throw new Error(
					response.error?.message || "Failed to migrate documents",
				);
			}

			return response.data;
		},
		onSuccess: (data) => {
			toast.success("Migration completed!", {
				description: `Successfully migrated ${data?.migratedCount} documents`,
			});
			setIsMigrateDialogOpen(false);
		},
		onError: (error) => {
			toast.error("Migration failed", {
				description: error instanceof Error ? error.message : "Unknown error",
			});
		},
	});

	function generateInstallCommand() {
		if (!selectedClient) return "";

		let command = `npx -y install-mcp@latest https://api.supermemory.ai/mcp --client ${selectedClient} --oauth=yes`;

		if (selectedProject && selectedProject !== "none") {
			// Remove the "sm_project_" prefix from the containerTag
			const projectIdForCommand = selectedProject.replace(/^sm_project_/, "");
			command += ` --project ${projectIdForCommand}`;
		}

		return command;
	}

	const copyToClipboard = () => {
		const command = generateInstallCommand();
		navigator.clipboard.writeText(command);
		analytics.mcpInstallCmdCopied();
		toast.success("Copied to clipboard!");
	};

	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-4xl">
				<DialogHeader>
					<DialogTitle>Connect Supermemory to Your AI</DialogTitle>
					<DialogDescription>
						Connect supermemory to your favorite AI tools using the Model
						Context Protocol (MCP). This allows your AI assistant to create,
						search, and access your memories directly.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Step 1: Client Selection */}
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${"bg-white/10 text-white/60"}`}
							>
								1
							</div>
							<h3 className="text-sm font-medium">Select Your AI Client</h3>
						</div>

						<div className="space-x-2 space-y-2">
							{Object.entries(clients)
								.slice(0, 7)
								.map(([key, clientName]) => (
									<button
										className={`pr-3 pl-1 rounded-full border cursor-pointer transition-all ${
											selectedClient === key
												? "border-blue-500 bg-blue-500/10"
												: "border-white/10 hover:border-white/20 hover:bg-white/5"
										}`}
										key={key}
										onClick={() =>
											setSelectedClient(key as keyof typeof clients)
										}
										type="button"
									>
										<div className="flex items-center gap-1">
											<div className="w-8 h-8 flex items-center justify-center">
												<Image
													alt={clientName}
													className="rounded object-contain text-white fill-white"
													height={20}
													onError={(e) => {
														const target = e.target as HTMLImageElement;
														target.style.display = "none";
														const parent = target.parentElement;
														if (
															parent &&
															!parent.querySelector(".fallback-text")
														) {
															const fallback = document.createElement("span");
															fallback.className =
																"fallback-text text-sm font-bold text-white/40";
															fallback.textContent = clientName
																.substring(0, 2)
																.toUpperCase();
															parent.appendChild(fallback);
														}
													}}
													src={
														key === "mcp-url"
															? "/mcp-icon.svg"
															: `/mcp-supported-tools/${key === "claude-code" ? "claude" : key}.png`
													}
													width={20}
												/>
											</div>
											<span className="text-sm font-medium text-white/80">
												{clientName}
											</span>
										</div>
									</button>
								))}
						</div>
					</div>

					{/* Step 2: Project Selection or MCP URL */}
					{selectedClient && (
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-full bg-white/10 text-white/60 flex items-center justify-center text-sm font-medium">
									2
								</div>
								<h3 className="text-sm font-medium">
									{selectedClient === "mcp-url"
										? "MCP Server URL"
										: "Select Target Project (Optional)"}
								</h3>
							</div>

							{selectedClient === "mcp-url" ? (
								<div className="space-y-2">
									<div className="relative">
										<Input
											className="font-mono text-xs w-full pr-10"
											readOnly
											value="https://api.supermemory.ai/mcp"
										/>
										<Button
											className="absolute top-[-1px] right-0 cursor-pointer"
											onClick={() => {
												navigator.clipboard.writeText(
													"https://api.supermemory.ai/mcp",
												);
												analytics.mcpInstallCmdCopied();
												toast.success("Copied to clipboard!");
											}}
											variant="ghost"
										>
											<CopyIcon className="size-4" />
										</Button>
									</div>
									<p className="text-xs text-white/50">
										Use this URL to configure supermemory in your AI assistant
									</p>
								</div>
							) : (
								<div className="max-w-md">
									<Select
										disabled={isLoadingProjects}
										onValueChange={setSelectedProject}
										value={selectedProject || "none"}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select project" />
										</SelectTrigger>
										<SelectContent className="bg-black/90 backdrop-blur-xl border-white/10">
											<SelectItem
												className="text-white hover:bg-white/10"
												value="none"
											>
												Auto-select project
											</SelectItem>
											<SelectItem
												className="text-white hover:bg-white/10"
												value="sm_project_default"
											>
												Default Project
											</SelectItem>
											{projects
												.filter(
													(p: Project) =>
														p.containerTag !== "sm_project_default",
												)
												.map((project: Project) => (
													<SelectItem
														className="text-white hover:bg-white/10"
														key={project.id}
														value={project.containerTag}
													>
														{project.name}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
								</div>
							)}
						</div>
					)}

					{/* Step 3: Command Line */}
					{selectedClient && selectedClient !== "mcp-url" && (
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-full bg-white/10 text-white/60 flex items-center justify-center text-sm font-medium">
									3
								</div>
								<h3 className="text-sm font-medium">Installation Command</h3>
							</div>

							<div className="relative">
								<Input
									className="font-mono text-xs w-full pr-10"
									readOnly
									value={generateInstallCommand()}
								/>
								<Button
									className="absolute top-[-1px] right-0 cursor-pointer"
									onClick={copyToClipboard}
									variant="ghost"
								>
									<CopyIcon className="size-4" />
								</Button>
							</div>

							<p className="text-xs text-white/50">
								Copy and run this command in your terminal to install the MCP
								server
							</p>
						</div>
					)}

					{/* Blurred Command Placeholder */}
					{!selectedClient && (
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-full bg-white/10 text-white/60 flex items-center justify-center text-sm font-medium">
									3
								</div>
								<h3 className="text-sm font-medium">Installation Command</h3>
							</div>

							<div className="relative">
								<div className="w-full h-10 bg-white/5 border border-white/10 rounded-md flex items-center px-3">
									<div className="w-full h-4 bg-white/20 rounded animate-pulse blur-sm" />
								</div>
							</div>

							<p className="text-xs text-white/30">
								Select a client above to see the installation command
							</p>
						</div>
					)}

					<div className="gap-2 hidden">
						<div>
							<label
								className="text-sm font-medium text-white/80 block mb-2"
								htmlFor="mcp-server-url-desktop"
							>
								MCP Server URL
							</label>
							<p className="text-xs text-white/50 mt-2">
								Use this URL to configure supermemory in your AI assistant
							</p>
						</div>
						<div className="p-1 bg-white/5 rounded-lg border border-white/10 items-center flex px-2">
							<CopyableCell
								className="font-mono text-xs text-blue-400"
								value="https://api.supermemory.ai/mcp"
							/>
						</div>
					</div>

					<div>
						<h3 className="text-sm font-medium mb-3">What You Can Do</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>• Ask your AI to save important information as memories</li>
							<li>• Search through your saved memories during conversations</li>
							<li>• Get contextual information from your knowledge base</li>
							<li>• Seamlessly integrate with your existing AI workflow</li>
						</ul>
					</div>

					<div className="flex justify-between items-center pt-4 border-t">
						<div className="flex items-center gap-4">
							<Button
								onClick={() =>
									window.open(
										"https://docs.supermemory.ai/supermemory-mcp/introduction",
										"_blank",
									)
								}
								variant="outline"
							>
								<ExternalLink className="w-2 h-2 mr-2" />
								Learn More
							</Button>

							<Button
								onClick={() => setIsMigrateDialogOpen(true)}
								variant="outline"
							>
								Migrate from v1
							</Button>
						</div>
						<Button onClick={() => setIsOpen(false)}>Done</Button>
					</div>
				</div>
			</DialogContent>

			{/* Migration Dialog */}
			{isMigrateDialogOpen && (
				<Dialog
					onOpenChange={setIsMigrateDialogOpen}
					open={isMigrateDialogOpen}
				>
					<DialogContent className="sm:max-w-2xl bg-black/90 backdrop-blur-xl border-white/10 text-white">
						<div>
							<DialogHeader>
								<DialogTitle>Migrate from MCP v1</DialogTitle>
								<DialogDescription className="text-white/60">
									Migrate your MCP documents from the legacy system.
								</DialogDescription>
							</DialogHeader>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									mcpMigrationForm.handleSubmit();
								}}
							>
								<div className="grid gap-4">
									<div className="flex flex-col gap-2">
										<label className="text-sm font-medium" htmlFor="mcpUrl">
											MCP Link
										</label>
										<mcpMigrationForm.Field name="url">
											{({ state, handleChange, handleBlur }) => (
												<>
													<Input
														className="bg-white/5 border-white/10 text-white"
														id="mcpUrl"
														onBlur={handleBlur}
														onChange={(e) => handleChange(e.target.value)}
														placeholder="https://mcp.supermemory.ai/your-user-id/sse"
														value={state.value}
													/>
													{state.meta.errors.length > 0 && (
														<p className="text-sm text-red-400 mt-1">
															{state.meta.errors.join(", ")}
														</p>
													)}
												</>
											)}
										</mcpMigrationForm.Field>
										<p className="text-xs text-white/50">
											Enter your old MCP Link in the format: <br />
											<span className="font-mono">
												https://mcp.supermemory.ai/userId/sse
											</span>
										</p>
									</div>
								</div>
								<div className="flex justify-end gap-3 mt-4">
									<Button
										className="bg-white/5 hover:bg-white/10 border-white/10 text-white"
										onClick={() => {
											setIsMigrateDialogOpen(false);
											mcpMigrationForm.reset();
										}}
										type="button"
										variant="outline"
									>
										Cancel
									</Button>
									<Button
										className="bg-white/10 hover:bg-white/20 text-white border-white/20"
										disabled={
											migrateMCPMutation.isPending ||
											!mcpMigrationForm.state.canSubmit
										}
										type="submit"
									>
										{migrateMCPMutation.isPending ? (
											<>
												<Loader2 className="h-4 w-4 animate-spin mr-2" />
												Migrating...
											</>
										) : (
											"Migrate"
										)}
									</Button>
								</div>
							</form>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</Dialog>
	);
}
