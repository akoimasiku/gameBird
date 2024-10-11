import time
from brownie import (
    accounts,
    network,
    MyStrategy,
    TheVault,
    AdminUpgradeabilityProxy,
    interface,
)
from _setup.config import (
    WANT,
    REGISTRY,
    PERFORMANCE_FEE_GOVERNANCE,
    PERFORMANCE_FEE_STRATEGIST,
    WITHDRAWAL_FEE,
    MANAGEMENT_FEE,
)
from helpers.constants import AddressZero
import click
from rich.console import Console

console = Console()
SLEEP_BETWEEN_TX = 1

def get_registry_actors(registry_address):
    try:
       registry = interface.IBadgerRegistry(registry_address)
    return {
            "strategist": registry.get("governance"),
            "badgerTree": registry.get("badgerTree"),
            "guardian": registry.get("guardian"),
            "keeper": registry.get("keeper"),
            "proxyAdmin": registry.get("proxyAdminTimelock"),
           }
    except Exception as e:
        console.print(f"[red]Error retrieving registry actors: {e}[/red]")

def deploy_contract(contract_class, initializer_args, proxy_admin, deployer, sleep_between_tx=DEFAULT_SLEEP_BETWEEN_TX):
    try:
        logic = contract_class.deploy({"from": deployer})
        logic.tx.wait(1)
        time.sleep(sleep_between_tx)

        proxy = AdminUpgradeabilityProxy.deploy(
            logic,
            proxy_admin,
            logic.initialize.encode_input(*initializer_args),
            {"from": deployer},
        )
        proxy.tx.wait(1) 
        console.print(f"[green]Contract {contract_class._name} deployed at {proxy.address}[/green]")
        return contract_class.at(proxy.address)
    except Exception as e:
        console.print(f"[red]Failed to deploy {contract_class._name}: {e}[/red]")
        raise

def deploy_vault(governance, keeper, guardian, strategist, badgerTree, proxy_admin, name, symbol, deployer):
    args = [
        WANT,
        governance,
        keeper,
        guardian,
        governance,
        strategist,
        badgerTree,
        name,
        symbol,
        [
            PERFORMANCE_FEE_GOVERNANCE,
            PERFORMANCE_FEE_STRATEGIST,
            WITHDRAWAL_FEE,
            MANAGEMENT_FEE,
        ],
    ]
    console.print("[green]Deploying Vault...[/green]")
    vault = deploy_contract(TheVault, args, proxy_admin, deployer)
    console.print("[green]Vault deployed at: [/green]", vault.address)
    return vault

def deploy_strategy(vault, proxy_admin, deployer):
    args = [vault, [WANT]]
    console.print("[green]Deploying Strategy...[/green]")
    strategy = deploy_contract(MyStrategy, args, proxy_admin, deployer)
    console.print("[green]Strategy deployed at: [/green]", strategy.address)
    return strategy


def connect_account():
    click.echo(f"You are using the '{network.show_active()}' network")
    dev = accounts.load(click.prompt("Account", type=click.Choice(accounts.load())))
    click.echo(f"You are using: 'dev' [{dev.address}]")
    return dev

def validate_actors(actors):
    for role, address in actors.items():
        assert address != AddressZero, f"{role} address is zero"

def main():
    dev = connect_account()
    actors = get_registry_actors(REGISTRY)
    validate_actors(actors)

    name = "FTM STRAT"
    symbol = "bFRM-STrat"

    vault = deploy_vault(
        dev.address,
        actors["keeper"],
        actors["guardian"],
        actors["strategist"],
        actors["badgerTree"],
        actors["proxyAdmin"],
        name,
        symbol,
        dev,
    )

    strategy = deploy_strategy(vault, actors["proxyAdmin"], dev)

    tx = vault.setStrategy(strategy, {"from": dev})
    tx.wait(1)  # Wait for confirmation
    console.print(f"[green]Strategy set with tx: {tx.txid}[/green]")
