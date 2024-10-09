package com.practice;

// Abstract class defining base behavior and structure for subclasses
public abstract class AbstractClass {

    // Protected constructor, allowing instantiation only by subclasses
    protected AbstractClass() {
        System.out.println("AbstractClass constructor called.");
    }

    // Abstract method to be implemented by subclasses
    public abstract void printMessage();

    // Final method ensuring subclass cannot override it
    public final void invokeMessage() {
        System.out.println("Final method in AbstractClass.");
        printMessage();  // Subclass-specific implementation is invoked
    }

    // Static method that can be called without an instance
    public static void logStaticMessage() {
        System.out.println("Static method in AbstractClass called.");
    }
}

